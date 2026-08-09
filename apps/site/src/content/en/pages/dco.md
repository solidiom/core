---
title: Developer Certificate of Origin
description: The DCO signoff requirement for Solidiom contributions.
locale: en
---

# Developer Certificate of Origin

**Effective date:** 2025-01-01

## What is the DCO?

The [Developer Certificate of Origin](https://developercertificate.org/) (DCO) is a lightweight way for contributors to certify that they wrote or have the right to submit the code they are contributing to the project.

By signing-off on a commit, the certifier declares:

> By making a contribution to this project, I certify that:
>
> 1. The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or
> 2. The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications, whether created in whole or in part by me, under the same open source license (unless I am permitted to submit under a different license), as indicated in the file; or
> 3. The contribution was provided directly to me by some other person who certified (1), (2) or (3) and I have not modified it.
>
> I understand and agree that this project and the contribution are public and that a record of the contribution (including all personal information I submit with it, including my sign-off) is maintained indefinitely and may be redistributed consistent with this project or the open source license(s) involved.

## How to Sign Off

Include a `Signed-off-by` line in every commit message:

```
Signed-off-by: Your Name <your.email@example.com>
```

Use the `-s` flag with `git commit`:

```sh
git commit -s -m "Your commit message"
```

The name and email must match your Git user configuration. Contributions without a DCO signoff will not be merged.

## Why We Require It

The DCO provides a paper trail that:

- Confirms the contributor has the right to submit the code
- Protects the project from copyright claims
- Is lighter weight than a full CLA (Contributor License Agreement)
- Works for both individual and corporate contributors

## Scope

The DCO applies to all contributions to the Solidiom project, including:

- Code, recipes, and blocks
- Documentation and prose
- Translations
- Configuration files and scripts
- Issues and pull request descriptions

## Questions?

If you're unsure whether your contribution can carry a DCO signoff, open an issue or reach out to the maintainers before submitting.
