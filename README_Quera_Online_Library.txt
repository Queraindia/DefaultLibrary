Quera Music — Online Library update

Files:
- Quera_Online_Library_Update.html: updated single-file app.

What changed:
- Home screen and add menu now offer Connect to Online Library.
- Search catalog by song or artist; examples include Arijit Singh and Shreya Ghoshal.
- Play catalog-provided 30-second previews or add results to the library.
- Right-click a library track for Play/preview and Remove from library actions. Right-click a catalog result to add it to the library.
- Online preview tracks are passed to the existing loadMedia()/buildDSPChain() player path. Existing audio-processing, DSP and Quera Atmosphere methods were not edited.

Notes:
- Online results come from the iTunes Search API and require internet access. Only tracks with catalog preview URLs are shown; this is not a full-song streaming service.
- Test in the same browser/environment where the original file ran. Some hosting environments may impose CORS restrictions on preview audio.
