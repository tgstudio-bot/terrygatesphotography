(function () {
  var script = document.querySelector("script[src*='js/site.js']");
  var src = script ? script.getAttribute("src") : "js/site.js";
  var root = src.slice(0, src.indexOf("js/site.js"));

  function asset(path) {
    return root + path;
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var treatments = {
    lifestyle: "horizontal",
    studio: "parallax",
    "360": "teaser",
    event: "inset",
    "3d": "circle",
    ai: "stack"
  };

  function splitWords(el, text) {
    el.replaceChildren();
    text.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        el.append(part);
        return;
      }
      var span = document.createElement("span");
      span.className = "word";
      span.textContent = part;
      el.append(span);
    });
  }

  function photoImg(photo) {
    var img = document.createElement("img");
    img.src = asset(photo.file || photo.thumb);
    img.alt = photo.alt || photo.title || "";
    if (photo.width) img.width = photo.width;
    if (photo.height) img.height = photo.height;
    img.loading = "lazy";
    img.decoding = "async";
    return img;
  }

  function photoFigure(photo) {
    var fig = document.createElement("figure");
    fig.append(photoImg(photo));
    return fig;
  }

  function brandNode(text, tag) {
    var el = document.createElement(tag || "span");
    el.className = "brand";
    el.textContent = text;
    return el;
  }

  function fillBio(copy) {
    var text = document.querySelector(".bio-text");
    var links = document.querySelector(".bio-links");
    if (!text || !links) return;
    splitWords(text, copy.bio);
    links.replaceChildren();
    var ig = document.createElement("a");
    ig.href = copy.instagram;
    ig.textContent = copy.instagramLabel;
    ig.target = "_blank";
    ig.rel = "noopener";
    var bar = document.createElement("span");
    bar.className = "bar";
    bar.setAttribute("aria-hidden", "true");
    bar.textContent = "|";
    var web = document.createElement("a");
    web.href = copy.web;
    web.textContent = copy.webLabel;
    web.target = "_blank";
    web.rel = "noopener";
    links.append(ig, bar, web);
  }

  function fillClients(copy) {
    var section = document.querySelector(".clients");
    if (!section) return;
    section.replaceChildren();
    var h = document.createElement("h2");
    h.textContent = copy.clientsTitle;
    var featured = document.createElement("div");
    featured.className = "featured";
    copy.featured.forEach(function (name) {
      featured.append(brandNode(name, "span"));
    });
    var columns = document.createElement("ul");
    columns.className = "columns";
    copy.columns.forEach(function (col) {
      var li = document.createElement("li");
      col.forEach(function (name) {
        li.append(brandNode(name, "span"));
        li.append(document.createElement("br"));
      });
      columns.append(li);
    });
    section.append(h, featured, columns);
  }

  function fillContact(copy) {
    var section = document.querySelector(".contact");
    if (!section) return;
    section.replaceChildren();
    var h = document.createElement("h2");
    h.textContent = copy.contactHeading;
    var rule = document.createElement("div");
    rule.className = "rule";
    var p = document.createElement("p");
    p.textContent = copy.contact;
    var mail = document.createElement("a");
    mail.className = "mail";
    mail.href = "mailto:" + copy.email;
    mail.textContent = copy.email;
    var ig = document.createElement("a");
    ig.className = "mail";
    ig.href = copy.instagram;
    ig.target = "_blank";
    ig.rel = "noopener";
    ig.textContent = copy.instagramLabel;
    section.append(h, rule, p, mail, ig);
  }

  function renderSection(section, tours) {
    var el = document.createElement("section");
    el.id = section.id;
    el.className = "block block-" + section.id;
    var opener = document.createElement("div");
    opener.className = "opener";
    var num = document.createElement("p");
    num.className = "opener-num";
    num.textContent = section.number;
    var heading = document.createElement("h2");
    heading.textContent = section.title;
    opener.append(num, heading);
    el.append(opener);

    var kind = treatments[section.id] || "grid";
    if (kind === "horizontal") {
      var wrap = document.createElement("div");
      wrap.className = "h-wrap";
      var track = document.createElement("div");
      track.className = "h-track";
      section.photos.forEach(function (photo) {
        track.append(photoFigure(photo));
      });
      wrap.append(track);
      el.append(wrap);
    } else if (kind === "stack") {
      var stack = document.createElement("div");
      stack.className = "ai-stack";
      section.photos.forEach(function (photo) {
        var card = document.createElement("article");
        card.className = "ai-card";
        card.append(photoFigure(photo));
        stack.append(card);
      });
      el.append(stack);
    } else if (kind === "teaser") {
      var box = document.createElement("div");
      box.className = "tour-teaser";
      section.photos.forEach(function (photo) {
        box.append(photoFigure(photo));
      });
      var grid = document.createElement("div");
      grid.className = "tour-grid";
      tours.forEach(function (tour) {
        var link = document.createElement("a");
        link.className = "tour-tile";
        link.href = "360/index.html";
        var img = photoImg(tour);
        var cap = document.createElement("span");
        cap.textContent = tour.title;
        link.append(img, cap);
        grid.append(link);
      });
      var more = document.createElement("a");
      more.className = "view-all";
      more.href = "360/index.html";
      more.textContent = "View";
      box.append(grid, more);
      el.append(box);
    } else {
      var gridWrap = document.createElement("div");
      gridWrap.className = kind === "parallax" ? "studio-grid" : "clip-grid";
      section.photos.forEach(function (photo) {
        gridWrap.append(photoFigure(photo));
      });
      el.append(gridWrap);
    }
    return el;
  }

  function fillNav(sections) {
    var nav = document.querySelector(".top-nav");
    if (!nav || document.body.getAttribute("data-page") !== "home") return;
    nav.replaceChildren();
    [
      ["#bio", "About"],
      ["#clients", "Clients"]
    ].concat(sections.map(function (section) {
      return ["#" + section.id, section.title];
    })).concat([["#contact", "Contact"]]).forEach(function (item) {
      var a = document.createElement("a");
      a.href = item[0];
      a.textContent = item[1];
      nav.append(a);
    });
  }

  function fillTours(tours) {
    var mosaic = document.querySelector(".tour-mosaic");
    if (!mosaic) return;
    mosaic.replaceChildren();
    tours.forEach(function (tour) {
      var link = document.createElement("a");
      link.className = "tour-tile";
      link.href = tour.url;
      link.target = "_blank";
      link.rel = "noopener";
      var img = photoImg(tour);
      var cap = document.createElement("span");
      cap.textContent = tour.title;
      link.append(img, cap);
      mosaic.append(link);
    });
  }

  function initLenis() {
    if (reduced || !window.Lenis || !window.gsap || !window.ScrollTrigger) return;
    var lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  function initHomeMotion() {
    if (reduced || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    initLenis();

    var hero = document.querySelector(".hero");
    var heroImg = document.querySelector(".hero-img");
    var veil = document.querySelector(".hero-veil");
    if (hero && heroImg) {
      gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: true,
          invalidateOnRefresh: true
        }
      })
        .to(heroImg, { scale: 1.14, ease: "none" }, 0)
        .to(veil, { opacity: 0.78, ease: "none" }, 0);
    }

    var words = document.querySelectorAll(".bio-text .word");
    var bio = document.querySelector(".bio");
    if (bio && words.length) {
      gsap.to(words, {
        opacity: 1,
        ease: "none",
        stagger: { each: 0.08, from: "start" },
        scrollTrigger: {
          trigger: bio,
          start: "top 75%",
          end: "bottom 55%",
          scrub: true
        }
      });
    }

    var brands = document.querySelectorAll(".brand");
    if (brands.length) {
      gsap.set(brands, { opacity: 0, y: 16 });
      ScrollTrigger.batch(brands, {
        start: "top 92%",
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, { opacity: 1, y: 0, stagger: 0.03, duration: 0.45, ease: "power1.out", overwrite: true });
        }
      });
    }

    var mm = gsap.matchMedia();
    mm.add("(min-width: 701px)", function () {
      document.querySelectorAll(".h-wrap").forEach(function (wrap) {
        var track = wrap.querySelector(".h-track");
        if (!track) return;
        gsap.to(track, {
          x: function () { return -Math.max(0, track.scrollWidth - wrap.clientWidth); },
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: function () { return "+=" + Math.max(0, track.scrollWidth - wrap.clientWidth); },
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        });
      });
    });

    document.querySelectorAll("#studio figure").forEach(function (fig, i) {
      var shift = 24 + (i % 3) * 26;
      gsap.fromTo(fig, { y: shift }, {
        y: -shift,
        ease: "none",
        scrollTrigger: {
          trigger: fig,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    document.querySelectorAll("#event img").forEach(function (img) {
      gsap.fromTo(img, { clipPath: "inset(24% 24% 24% 24%)" }, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top 90%",
          end: "top 40%",
          scrub: true
        }
      });
    });

    var threeD = document.getElementById("3d");
    if (threeD) threeD.querySelectorAll("img").forEach(function (img) {
      gsap.fromTo(img, { clipPath: "circle(10% at 50% 50%)" }, {
        clipPath: "circle(80% at 50% 50%)",
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top 90%",
          end: "center 55%",
          scrub: true
        }
      });
    });

    var tourTiles = document.querySelectorAll(".tour-teaser .tour-tile");
    if (tourTiles.length) {
      gsap.fromTo(tourTiles, { opacity: 0.2, y: 36 }, {
        opacity: 1,
        y: 0,
        ease: "none",
        stagger: 0.06,
        scrollTrigger: {
          trigger: ".tour-teaser",
          start: "top 75%",
          end: "center 40%",
          scrub: true
        }
      });
    }

    var cards = document.querySelectorAll(".ai-card");
    cards.forEach(function (card, i) {
      if (i === cards.length - 1) return;
      var next = cards[i + 1];
      gsap.to(card.querySelector("img"), {
        scale: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: next,
          start: "top bottom",
          end: "top 15%",
          scrub: true
        }
      });
    });

    var rule = document.querySelector(".contact .rule");
    if (rule) {
      gsap.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#contact",
          start: "top 75%",
          end: "top 35%",
          scrub: true
        }
      });
    }

    document.querySelectorAll("img").forEach(function (img) {
      if (img.complete) return;
      img.addEventListener("load", function () { ScrollTrigger.refresh(); }, { once: true });
    });
    ScrollTrigger.refresh();
  }

  function initToursMotion() {
    if (reduced || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    initLenis();
    var tiles = document.querySelectorAll(".tour-tile");
    if (!tiles.length) return;
    gsap.set(tiles, { opacity: 0, y: 24 });
    ScrollTrigger.batch(tiles, {
      start: "top 90%",
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power1.out", overwrite: true });
      }
    });
  }

  function initMenu() {
    var btn = document.querySelector(".menu-btn");
    var nav = document.querySelector(".top-nav");
    if (!btn || !nav) return;

    function setOpen(open) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    }

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      setOpen(open);
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (btn.getAttribute("aria-expanded") !== "true") return;
      if (e.key === "Escape") {
        setOpen(false);
        btn.focus();
        return;
      }
      if (e.key !== "Tab") return;
      var items = [btn].concat(Array.prototype.slice.call(nav.querySelectorAll("a")));
      var index = items.indexOf(document.activeElement);
      if (index < 0) return;
      e.preventDefault();
      var next = e.shiftKey ? (index - 1 + items.length) % items.length : (index + 1) % items.length;
      items[next].focus();
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") || e.target === nav) setOpen(false);
    });
  }

  var page = document.body.getAttribute("data-page");
  initMenu();

  if (page === "tours") {
    fetch(asset("data/360.json"))
      .then(function (res) {
        if (!res.ok) throw new Error("360.json " + res.status);
        return res.json();
      })
      .then(function (tours) {
        fillTours(tours);
        initToursMotion();
      })
      .catch(function (err) { console.error(err); });
    return;
  }

  if (page !== "home") return;

  Promise.all([
    fetch(asset("data/copy.json")).then(function (res) {
      if (!res.ok) throw new Error("copy.json " + res.status);
      return res.json();
    }),
    fetch(asset("data/portfolio.json")).then(function (res) {
      if (!res.ok) throw new Error("portfolio.json " + res.status);
      return res.json();
    }),
    fetch(asset("data/360.json")).then(function (res) {
      if (!res.ok) throw new Error("360.json " + res.status);
      return res.json();
    })
  ]).then(function (data) {
    var copy = data[0];
    var portfolio = data[1];
    var tours = data[2];
    fillBio(copy);
    fillClients(copy);
    fillContact(copy);
    var host = document.getElementById("galleries");
    if (host) {
      portfolio.sections.forEach(function (section) {
        host.append(renderSection(section, tours));
      });
    }
    fillNav(portfolio.sections);
    initHomeMotion();
    window.addEventListener("load", function () {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  }).catch(function (err) { console.error(err); });
})();
