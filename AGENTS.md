<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep homepage and dedicated service-page header/footer markup in shared SiteChrome components so navigation and branding stay consistent without coupling service pages to reservation logic.
- Store dedicated service content in a browser-safe data module and render it through one shared page component; leaf route files own their metadata and canonical URLs for independent indexing.
- Keep airport pickup detection and flight-required validation in a browser-safe helper shared by homepage validation and tests, so airport destination alone never requires a flight number.
