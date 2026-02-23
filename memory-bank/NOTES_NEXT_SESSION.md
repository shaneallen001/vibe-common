# Notes for Next Session

**Last Updated:** 2026-02-22

- Memory Bank system is now active in `vibe-common`. Maintain protocols accordingly.
- **Priority Bug Fixed:** Journal placement and assignment logic was fragile because it relied on `roomIndex`. This has been updated to use `data-room-id` attributes in the generated SVG mapped to `id` values in the textual Outline, providing a hard link and preventing misaligned journals.
