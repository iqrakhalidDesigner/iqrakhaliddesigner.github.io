# Iqra Khalid — design portfolio

Open `index.html` in a modern browser to preview the site. No installation, build step, CDN, or local server is required.

## Edit your portfolio

- **Projects and case studies** — Edit `portfolio.js`. Each entry sets its title, category, cover image, alt text, Behance link, summary, and case-study details. Add fields such as “Brief”, “My role”, “Process”, and “Outcome” under `details` when you have information to share. Categories appear automatically in the filter.
- **Images** — Place new files in `assets/` and use relative paths such as `assets/new-project.jpg`. Set `mark` to the project’s initials or date for the fallback cover.
- **CV** — Put a public copy of your PDF in `assets/` and set `cvFile` to its relative path in `portfolio.js`. The download link replaces the “CV available on request” text.
- **Contact** — Set `email` in `portfolio.js` to enable the email link. Edit the LinkedIn and Behance links in the footer of `index.html`.
- **Bio, skills, and experience** — Edit `index.html`. All roles share one career timeline, with dates from your LinkedIn PDF and multiple roles grouped by employer. Skills and tools come from your LinkedIn PDF, CV, and published work.
- **Image sources** — Portrait and eight employer logos from your supplied files. Other employer logos come from the official sites of the School Education Department, Game Rezort, DevBatch, and The Game Storm Studios. Project covers come from Behance. Software marks come from [Devicon](https://github.com/devicons/devicon), with its license in `assets/devicon-license.txt`.
- **Colors and typography** — Edit the custom properties at the top of `styles.css`.

## Host it

Edit the About intro, Education and Design Notes sections, and portfolio guide links in `index.html`. The contact form prepares a local draft that visitors can copy or send through their mail app when you configure your public email. The form does not transmit messages on its own. The university logos are bundled from [University of the Punjab](https://pu.edu.pk/) and [University of Education](https://ue.edu.pk/).

Upload `index.html`, `styles.css`, `portfolio.js`, `app.js`, and the entire `assets/` folder to the same directory on any static web host. Set that directory as the site root or serve it from a subfolder. Keep the relative paths and filename capitalization intact.
