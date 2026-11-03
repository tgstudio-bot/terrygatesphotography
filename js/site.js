(function () {
  var script = document.querySelector("script[src*='js/site.js']");
  var src = script ? script.getAttribute("src") : "js/site.js";
  var root = src.slice(0, src.indexOf("js/site.js"));

  function asset(path) {
    return root + path;
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  function initMotion() {
    if (reduced || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      var lenis = new Lenis({ autoRaf: false });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

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
  }

  var page = document.body.getAttribute("data-page");
  if (page !== "home") return;

  fetch(asset("data/copy.json"))
    .then(function (res) {
      if (!res.ok) throw new Error("copy.json " + res.status);
      return res.json();
    })
    .then(function (copy) {
      fillBio(copy);
      initMotion();
    })
    .catch(function (err) {
      console.error(err);
    });
})();
