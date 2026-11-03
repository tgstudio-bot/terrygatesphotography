# Terry Gates

Photography portfolio. The pages are static files. Open `index.html` through a local web server, or publish the folder with GitHub Pages.

## How to add photos

You will add one image file and one line in a list. You do not need to edit the layout.

1. Save the photograph as a JPEG in the `photos` folder. Use the same kind of name as the files already there, such as `lifestyle-31.jpg`. Keep the long edge at 2000 pixels or under.
2. Open `data/portfolio.json` in a text editor.
3. Find the section that should show the photograph. The sections are `lifestyle`, `studio`, `360`, `event`, `3d`, and `ai`.
4. Add one object at the end of that section's `photos` list. Copy the commas from the line above it.
5. Save the file and refresh the site. The new photograph appears in that section.

Example line for a lifestyle photograph:

```json
{ "file": "photos/lifestyle-31.jpg", "alt": "Lifestyle photograph 31", "width": 1600, "height": 1200 }
```

`file` is the path from the site folder. `alt` is a short description. `width` and `height` are the pixel size of the saved JPEG.

## How to add a 360 piece

1. Save a thumbnail JPEG in `photos/360/`, for example `photos/360/new-piece.jpg`.
2. Open `data/360.json`.
3. Add one object to the list.

```json
{ "title": "Virtual Vanity", "url": "https://terrygates360.com/vsing/", "thumb": "photos/360/vsing.jpg", "width": 1800, "height": 1000, "alt": "Virtual Vanity 360 photograph" }
```

Use the real tour address in `url`. The home page links to the 360 page. The 360 page opens that address in a new tab.
