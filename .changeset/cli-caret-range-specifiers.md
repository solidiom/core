---
"@solidiom/cli": patch
---

Resolve registry package versions as caret ranges (e.g. `^0.3.0`) instead of exact pins when planning installs. Consumers now pick up in-range single-package releases without a registry regeneration. Pre-release versions and dist-tags are left unchanged.
