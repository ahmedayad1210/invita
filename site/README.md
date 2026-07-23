# Invita static site

Production static build of the Invita IV-drips marketing site (EN + Arabic RTL).

## Local preview

```bash
cd site
python3 -m http.server 8080
# open http://localhost:8080/
```

## Netlify deploy

**Drag and drop:** zip the contents of `site/` (or the folder itself) and drop onto [app.netlify.com/drop](https://app.netlify.com/drop).

**CLI:**

```bash
npm i -g netlify-cli
cd site
netlify deploy --prod --dir .
```

`netlify.toml` in this folder sets `publish = "."`.
