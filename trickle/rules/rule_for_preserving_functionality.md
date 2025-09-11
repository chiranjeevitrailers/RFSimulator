# Rule for Preserving Existing Functionality

When making enhancements or additions to the platform:

- Always preserve existing working components and functionality
- Use `file_str_replace` for targeted updates instead of complete rebuilds with `file_write`
- Before making changes, identify what existing features need to be maintained
- When adding new features, integrate them with existing code rather than replacing entire files
- If a component was working before, ensure it continues to work after updates
- Never remove user-requested features that were previously implemented
- Always check if components like MessageDecoder, filters, or other UI elements exist before rebuilding