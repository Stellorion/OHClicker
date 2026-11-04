//! Random pixel offset ("Position jitter") with a tiny built-in random generator.
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

static JITTER_SEED: AtomicU64 = AtomicU64::new(0x9e3779b97f4a7c15);

/// Random offset inside a circle of radius `jitter` pixels.
pub(super) fn random_jitter(jitter: i32) -> (i32, i32) {
    if jitter == 0 {
        return (0, 0);
    }
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .subsec_nanos() as u64;
    let radius_seed = next_random(nanos);
    let angle_seed = next_random(radius_seed);
    let radius = (radius_seed as f64 / u64::MAX as f64).sqrt() * jitter as f64;
    let angle = angle_seed as f64 / u64::MAX as f64 * std::f64::consts::TAU;
    let mut x = (radius * angle.cos()).round() as i32;
    let mut y = (radius * angle.sin()).round() as i32;
    let distance = f64::hypot(x as f64, y as f64);
    if distance > jitter as f64 {
        x = (x as f64 * jitter as f64 / distance).round() as i32;
        y = (y as f64 * jitter as f64 / distance).round() as i32;
    }
    while x * x + y * y > jitter * jitter {
        if x.abs() >= y.abs() {
            x -= x.signum();
        } else {
            y -= y.signum();
        }
    }
    (x, y)
}

/// Tiny xorshift random number generator (no extra dependency).
fn next_random(salt: u64) -> u64 {
    let value = JITTER_SEED.fetch_add(0x9e3779b97f4a7c15, Ordering::Relaxed) ^ salt;
    let mut mixed = value;
    mixed ^= mixed >> 12;
    mixed ^= mixed << 25;
    mixed ^= mixed >> 27;
    mixed.wrapping_mul(0x2545f4914f6cdd1d)
}

#[cfg(test)]
mod tests {
    use super::random_jitter;

    #[test]
    fn zero_jitter_never_offsets() {
        assert_eq!(random_jitter(0), (0, 0));
    }

    #[test]
    fn jitter_stays_within_pixel_radius() {
        for _ in 0..1000 {
            let (x, y) = random_jitter(7);
            assert!(x * x + y * y <= 49);
        }
    }
}
