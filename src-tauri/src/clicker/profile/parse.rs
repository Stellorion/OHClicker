//! JSON text -> `ConfigProfile`. Nothing is applied here, it only checks the file.
//! Steps: 1) valid JSON  2) is an object  3) no missing keys  4) right types
//!        5) values in range (see validate.rs)
use super::fields::REQUIRED_FIELDS;
use super::{ConfigProfile, ProfileError, ProfileErrorKind};
use serde_json::Value;

/// Human readable name of a JSON value type, for error messages.
fn json_type_name(value: &Value) -> &'static str {
    match value {
        Value::Null => "null",
        Value::Bool(_) => "a boolean",
        Value::Number(_) => "a number",
        Value::String(_) => "a string",
        Value::Array(_) => "an array",
        Value::Object(_) => "an object",
    }
}

fn wrong_format(message: &str, details: Vec<String>) -> ProfileError {
    ProfileError::new(ProfileErrorKind::WrongFormat, message, details)
}

/// Parses and fully validates profile JSON.
pub fn parse_profile(text: &str) -> Result<ConfigProfile, ProfileError> {
    // Windows editors sometimes add a BOM, which serde_json rejects.
    let text = text.trim_start_matches('\u{feff}');

    let value: Value = serde_json::from_str(text).map_err(|e| {
        let message = "This file is not valid JSON, so it can't be imported.";
        ProfileError::new(ProfileErrorKind::InvalidJson, message, vec![e.to_string()])
    })?;

    let object = value.as_object().ok_or_else(|| {
        let found = format!(
            "Expected an object at the top level but found {}.",
            json_type_name(&value)
        );
        wrong_format(
            "This JSON doesn't look like an autoclicker profile.",
            vec![found],
        )
    })?;

    let missing: Vec<String> = REQUIRED_FIELDS
        .iter()
        .filter(|field| !object.contains_key(**field))
        .map(|field| format!("Missing field: \"{field}\""))
        .collect();
    if !missing.is_empty() {
        return Err(wrong_format(
            "This JSON doesn't match the profile format. Some settings are missing.",
            missing,
        ));
    }

    let profile: ConfigProfile = serde_json::from_value(value).map_err(|e| {
        let message = "This JSON doesn't match the profile format. A setting has the wrong type or an unknown value.";
        wrong_format(message, vec![e.to_string()])
    })?;

    let problems = profile.validate();
    if !problems.is_empty() {
        let message = "The profile contains values that are out of range or invalid.";
        return Err(ProfileError::new(
            ProfileErrorKind::InvalidValues,
            message,
            problems,
        ));
    }
    Ok(profile)
}
