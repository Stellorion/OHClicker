use enigo::{Button, Direction, Enigo, Mouse, Settings};
use std::sync::atomic::{AtomicBool, AtomicU32, AtomicU64, Ordering};
use std::sync::Arc;
use std::sync::OnceLock;
use std::thread;
use std::time::{Duration, Instant};
use tauri::AppHandle;

static CLICK_LOOP_INITIALIZED: OnceLock<()> = OnceLock::new();
static COUNTER: AtomicU64 = AtomicU64::new(0);

pub fn start_click_loop(
    _app_handle: AppHandle,
    is_running: Arc<AtomicBool>,
    cps: Arc<AtomicU32>,
    interval_randomization_pct: Arc<AtomicU32>,
    button_hold_ms: Arc<AtomicU32>,
    start_delay_ms: Arc<AtomicU32>,
) {
    CLICK_LOOP_INITIALIZED.get_or_init(move || {
        thread::spawn(move || {
            let mut enigo = match Enigo::new(&Settings::default()) {
                Ok(e) => e,
                Err(err) => {
                    eprintln!("Failed to initialize Enigo: {:?}", err);
                    return;
                }
            };

            let mut next_click = Instant::now();
            let mut has_delayed = false;

            loop {
                if is_running.load(Ordering::Relaxed) {
                    // Handle Start Delay on initial trigger
                    let delay = start_delay_ms.load(Ordering::Relaxed);
                    if delay > 0 && !has_delayed {
                        thread::sleep(Duration::from_millis(delay as u64));
                        has_delayed = true;
                        next_click = Instant::now();
                    }

                    let target_cps = cps.load(Ordering::Relaxed).max(1) as f64;
                    let pct = interval_randomization_pct.load(Ordering::Relaxed) as f64;
                    let hold_duration = Duration::from_millis(button_hold_ms.load(Ordering::Relaxed) as u64);

                    let randomized_cps = if pct > 0.0 {
                        let max_cps_variance = target_cps * (pct / 100.0);
                        let count = COUNTER.fetch_add(1, Ordering::Relaxed);
                        let range_int = (max_cps_variance * 2.0 + 1.0) as u32;
                        
                        let offset = if range_int > 0 {
                            ((count % range_int as u64) as f64) - max_cps_variance
                        } else {
                            0.0
                        };
                        (target_cps + offset).max(1.0)
                    } else {
                        target_cps
                    };

                    let interval_ms = 1000.0 / randomized_cps;

                    let now = Instant::now();
                    if now >= next_click {
                        let _ = enigo.button(Button::Left, Direction::Press);
                        if hold_duration > Duration::ZERO {
                            thread::sleep(hold_duration);
                        }
                        let _ = enigo.button(Button::Left, Direction::Release);

                        next_click = now + Duration::from_secs_f64(interval_ms / 1000.0);
                    } else {
                        let remaining = next_click - now;
                        if remaining > Duration::from_millis(2) {
                            thread::sleep(remaining - Duration::from_millis(1));
                        }
                        while Instant::now() < next_click {
                            std::hint::spin_loop();
                        }
                    }
                } else {
                    has_delayed = false;
                    thread::sleep(Duration::from_millis(20));
                    next_click = Instant::now();
                }
            }
        });
    });
}