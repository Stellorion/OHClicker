//! Opens the OS file manager with the linked profile selected.
use std::path::Path;
use std::process::Command;

/// Windows: `explorer /select,"<file>"` (falls back to the folder if the file is gone).
#[cfg(target_os = "windows")]
fn reveal(path: &Path) -> Result<(), String> {
    use std::os::windows::process::CommandExt;
    let argument = if path.exists() {
        format!("/select,\"{}\"", path.display())
    } else if let Some(folder) = path.parent().filter(|p| p.exists()) {
        format!("\"{}\"", folder.display())
    } else {
        return Err("The file and its folder no longer exist.".to_string());
    };
    // raw_arg: Explorer needs the quotes exactly as written.
    Command::new("explorer").raw_arg(argument).spawn().map(|_| ()).map_err(|e| e.to_string())
}

/// macOS: `open -R <file>` reveals it in Finder.
#[cfg(target_os = "macos")]
fn reveal(path: &Path) -> Result<(), String> {
    Command::new("open").arg("-R").arg(path).spawn().map(|_| ()).map_err(|e| e.to_string())
}

/// Linux: there is no standard "select file", so open the containing folder.
#[cfg(all(not(target_os = "windows"), not(target_os = "macos")))]
fn reveal(path: &Path) -> Result<(), String> {
    let folder = path.parent().ok_or("The file has no folder.")?;
    Command::new("xdg-open").arg(folder).spawn().map(|_| ()).map_err(|e| e.to_string())
}

/// Shows `path` in the file manager.
pub fn reveal_in_file_manager(path: &Path) -> Result<(), String> {
    reveal(path)
}
