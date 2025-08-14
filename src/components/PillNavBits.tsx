import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavBitsProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onItemClick?: (item: PillNavItem) => void;
}

const PillNavBits: React.FC<PillNavBitsProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#000',
  pillColor = '#fff',
  hoveredPillTextColor = '#fff',
  pillTextColor,
  onItemClick,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | HTMLElement | null>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');
        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;
        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }
        tlRefs.current[index] = tl;
      });
    };
    layout();
    const onResize = () => layout();
    window.addEventListener('resize', onResize);
    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }
    const navItems = navItemsRef.current;
    if (navItems) {
      gsap.set(navItems, { width: 0, overflow: 'hidden' });
      gsap.to(navItems, { width: 'auto', duration: 0.6, ease });
    }
    return () => window.removeEventListener('resize', onResize);
  }, [items, ease]);

  // pulse the active dot when the activeHref changes
  useEffect(() => {
    if (!activeHref) return;
    const idx = items.findIndex((i) => i.href === activeHref);
    const dot = dotRefs.current[idx];
    if (dot) {
      gsap.fromTo(dot, { scale: 0.7, opacity: 0.7 }, { scale: 1, opacity: 1, duration: 0.25, ease });
    }
  }, [activeHref, items, ease]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
  };
  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
  };

  const isExternalLink = (href: string) => /^(https?:\/\/|\/\/|mailto:|tel:|#)/.test(href);
  const isRouterLink = (href?: string) => href && !isExternalLink(href);

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '42px',
    ['--pill-pad-x']: '18px',
    ['--pill-gap']: '3px',
  } as React.CSSProperties;

  return (
    <nav className={`w-full flex items-center justify-start ${className}`} aria-label="Primary" style={cssVars}>
      <a
        href={items?.[0]?.href || '#'}
        aria-label="Home"
        onMouseEnter={() => {
          const img = logoImgRef.current; if (!img) return; logoTweenRef.current?.kill();
          gsap.set(img, { rotate: 0 }); logoTweenRef.current = gsap.to(img, { rotate: 360, duration: 0.2, ease, overwrite: 'auto' });
        }}
        ref={(el) => { logoRef.current = el; }}
        className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden"
        style={{ width: 'var(--nav-h)', height: 'var(--nav-h)', background: 'var(--base, #000)' }}
      >
        <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover block" />
      </a>

      <div ref={navItemsRef} className="relative items-center rounded-full flex ml-2" style={{ height: 'var(--nav-h)', background: 'var(--base, #000)' }}>
        <ul role="menubar" className="list-none flex items-stretch m-0 p-[3px] h-full" style={{ gap: 'var(--pill-gap)' }}>
          {items.map((item, i) => {
            const isActive = activeHref === item.href;
            const pillStyle: React.CSSProperties = {
              background: 'var(--pill-bg, #fff)',
              color: 'var(--pill-text, var(--base, #000))',
              paddingLeft: 'var(--pill-pad-x)',
              paddingRight: 'var(--pill-pad-x)',
            };
            const PillContent = (
              <>
                <span
                  className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                  style={{ background: 'var(--base, #000)', willChange: 'transform' }}
                  aria-hidden="true"
                  ref={(el) => { circleRefs.current[i] = el; }}
                />
                <span className="label-stack relative inline-block leading-[1] z-[2]">
                  <span className="pill-label relative z-[2] inline-block leading-[1]" style={{ willChange: 'transform' }}>{item.label}</span>
                  <span className="pill-label-hover absolute left-0 top-0 z-[3] inline-block" style={{ color: 'var(--hover-text, #fff)', willChange: 'transform, opacity' }} aria-hidden="true">{item.label}</span>
                </span>
                {isActive && (
                  <span
                    className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
                    style={{ background: 'var(--base, #000)' }}
                    aria-hidden="true"
                    ref={(el) => { dotRefs.current[i] = el; }}
                  />
                )}
              </>
            );
            const basePillClasses = 'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] uppercase whitespace-nowrap cursor-pointer px-0';
            const clickHandler = (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => {
              if (onItemClick) {
                e.preventDefault();
                onItemClick(item);
              }
              const t = e.currentTarget as HTMLElement;
              gsap.fromTo(t, { scale: 0.98 }, { scale: 1, duration: 0.18, ease });
            };

            return (
              <li key={item.href} role="none" className="flex h-full">
                {isRouterLink(item.href) ? (
                  <Link role="menuitem" to={item.href} className={basePillClasses} style={pillStyle} aria-label={item.ariaLabel || item.label} onMouseEnter={() => handleEnter(i)} onMouseLeave={() => handleLeave(i)} onClick={clickHandler}>
                    {PillContent}
                  </Link>
                ) : (
                  <a role="menuitem" href={item.href} className={basePillClasses} style={pillStyle} aria-label={item.ariaLabel || item.label} onMouseEnter={() => handleEnter(i)} onMouseLeave={() => handleLeave(i)} onClick={clickHandler}>
                    {PillContent}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default PillNavBits;


