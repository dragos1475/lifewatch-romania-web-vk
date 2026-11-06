import { createContext, useContext, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type SceneKind =
  | "about"
  | "infrastructure"
  | "platforms"
  | "data"
  | "api"
  | "docs"
  | "services"
  | "network"
  | "projects"
  | "faq"
  | "contact"
  | "not-found";

type Habitat =
  | "danube"
  | "coast"
  | "mountain"
  | "gorge"
  | "wetland"
  | "islands"
  | "watershed"
  | "alpine"
  | "volcanic"
  | "glacial";

export type PageMotionScene = { kind: SceneKind } | { kind: "landscape"; habitat: Habitat };

const stationHabitats: Record<string, Habitat> = {
  braila: "danube",
  "sfantu-gheorghe": "coast",
  sinaia: "mountain",
  orsova: "gorge",
};

const platformHabitats: Record<string, Habitat> = {
  "delta-dunarii": "wetland",
  "insulele-brailei": "islands",
  neajlov: "watershed",
  "bucegi-piatra-craiului": "alpine",
  "rodna-calimani": "volcanic",
  retezat: "glacial",
};

const routeScenes: Record<string, PageMotionScene> = {
  despre: { kind: "about" },
  infrastructura: { kind: "infrastructure" },
  platforme: { kind: "platforms" },
  date: { kind: "data" },
  "date/api": { kind: "api" },
  "date/documentatie": { kind: "docs" },
  servicii: { kind: "services" },
  retea: { kind: "network" },
  proiecte: { kind: "projects" },
  "intrebari-frecvente": { kind: "faq" },
  contact: { kind: "contact" },
};

export function sceneForRoute(routeKey: string | null): PageMotionScene | null {
  if (routeKey === null) return { kind: "not-found" };
  if (!routeKey) return null;

  const [, stationSlug] = routeKey.match(/^infrastructura\/([^/]+)$/) ?? [];
  if (stationSlug) return { kind: "landscape", habitat: stationHabitats[stationSlug] ?? "danube" };

  const [, platformSlug] = routeKey.match(/^platforme\/([^/]+)$/) ?? [];
  if (platformSlug) return { kind: "landscape", habitat: platformHabitats[platformSlug] ?? "wetland" };

  return routeScenes[routeKey] ?? { kind: "not-found" };
}

const PageMotionContext = createContext<PageMotionScene | null>(null);

export function PageMotionProvider({ scene, children }: { scene: PageMotionScene | null; children: ReactNode }) {
  return <PageMotionContext.Provider value={scene}>{children}</PageMotionContext.Provider>;
}

export function usePageMotionScene() {
  return useContext(PageMotionContext);
}

function Pulse({ cx, cy, color = "var(--brand-orange)", delay = 0, reduced }: { cx: number; cy: number; color?: string; delay?: number; reduced: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="7" fill={color} opacity="0.12" />
      <motion.circle
        cx={cx}
        cy={cy}
        r="2.6"
        fill={color}
        initial={false}
        animate={reduced ? { opacity: 0.9, scale: 1 } : { opacity: [0.42, 1, 0.42], scale: [0.85, 1.35, 0.85] }}
        transition={reduced ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
    </g>
  );
}

function Line({ d, color = "var(--brand-green)", width = 1.4, opacity = 0.62, delay = 0, reduced }: { d: string; color?: string; width?: number; opacity?: number; delay?: number; reduced: boolean }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeOpacity={opacity}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduced ? false : { pathLength: 0, opacity: 0.16 }}
      animate={{ pathLength: 1, opacity }}
      transition={{ duration: reduced ? 0 : 1.1, delay: reduced ? 0 : delay, ease: "easeOut" }}
    />
  );
}

function AboutArt({ reduced }: { reduced: boolean }) {
  return (
    <>
      <circle cx="180" cy="88" r="29" fill="var(--brand-green)" opacity="0.08" />
      <motion.ellipse
        cx="180"
        cy="88"
        rx="112"
        ry="38"
        fill="none"
        stroke="var(--brand-teal)"
        strokeOpacity="0.38"
        strokeWidth="1.2"
        initial={false}
        animate={reduced ? { rotate: 0 } : { rotate: 360 }}
        transition={reduced ? { duration: 0 } : { duration: 56, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "180px 88px" }}
      />
      <motion.ellipse
        cx="180"
        cy="88"
        rx="74"
        ry="62"
        fill="none"
        stroke="var(--brand-sand)"
        strokeOpacity="0.72"
        strokeWidth="1.1"
        strokeDasharray="3 7"
        initial={false}
        animate={reduced ? { rotate: 0 } : { rotate: -360 }}
        transition={reduced ? { duration: 0 } : { duration: 72, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "180px 88px" }}
      />
      <circle cx="180" cy="88" r="6" fill="var(--brand-green)" />
      <Pulse cx={69} cy={88} color="var(--brand-teal)" delay={0.3} reduced={reduced} />
      <Pulse cx={232} cy={54} delay={0.9} reduced={reduced} />
      <Pulse cx={252} cy={116} color="var(--brand-green)" delay={1.4} reduced={reduced} />
    </>
  );
}

function InfrastructureArt({ reduced }: { reduced: boolean }) {
  const contours = [
    "M18 132 C65 111 89 123 128 103 S203 96 245 110 S309 119 342 94",
    "M18 147 C68 127 93 138 132 119 S205 110 248 126 S309 132 342 109",
    "M20 67 C61 81 97 70 130 56 S198 58 225 74 S299 75 340 51",
  ];
  const hubs = [[56, 111], [145, 72], [238, 112], [314, 64]] as const;
  return (
    <>
      {contours.map((d, index) => <Line key={d} d={d} color={index === 1 ? "var(--brand-sand)" : "var(--brand-green)"} opacity={0.42} delay={index * 0.12} reduced={reduced} />)}
      <Line d="M56 111 L145 72 L238 112 L314 64" color="var(--brand-teal)" opacity={0.62} reduced={reduced} />
      {hubs.map(([cx, cy], index) => <Pulse key={`${cx}-${cy}`} cx={cx} cy={cy} delay={index * 0.42} reduced={reduced} />)}
      <motion.circle cx="56" cy="111" r="18" fill="none" stroke="var(--brand-orange)" strokeOpacity="0.3" strokeWidth="1" initial={false} animate={reduced ? { scale: 1, opacity: 0.3 } : { scale: [0.8, 1.35, 0.8], opacity: [0.12, 0.34, 0.12] }} transition={reduced ? { duration: 0 } : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "56px 111px" }} />
    </>
  );
}

function PlatformsArt({ reduced }: { reduced: boolean }) {
  return (
    <>
      <path d="M22 53 C70 39 103 47 142 43 S222 48 257 40 S320 43 340 36 L340 78 C300 83 280 78 242 87 S162 78 126 89 S64 80 22 91 Z" fill="var(--brand-green)" fillOpacity="0.1" />
      <path d="M22 89 C65 82 95 96 131 91 S204 99 244 90 S305 97 340 81 L340 119 C307 126 276 116 239 127 S166 119 128 129 S64 119 22 130 Z" fill="var(--brand-teal)" fillOpacity="0.11" />
      <path d="M22 130 C62 119 95 136 131 129 S205 140 241 128 S301 137 340 119 L340 151 C296 159 272 150 235 158 S164 150 126 161 S63 151 22 163 Z" fill="var(--brand-sand)" fillOpacity="0.25" />
      <Line d="M22 53 C70 39 103 47 142 43 S222 48 257 40 S320 43 340 36" color="var(--brand-green)" opacity={0.75} reduced={reduced} />
      <Line d="M22 91 C65 82 95 96 131 91 S204 99 244 90 S305 97 340 81" color="var(--brand-teal)" opacity={0.75} delay={0.1} reduced={reduced} />
      <Line d="M22 130 C62 119 95 136 131 129 S205 140 241 128 S301 137 340 119" color="var(--brand-sand)" opacity={0.9} delay={0.2} reduced={reduced} />
      <Pulse cx={96} cy={68} color="var(--brand-green)" delay={0.2} reduced={reduced} />
      <Pulse cx={242} cy={108} color="var(--brand-teal)" delay={0.8} reduced={reduced} />
      <Pulse cx={166} cy={145} delay={1.2} reduced={reduced} />
    </>
  );
}

function DataArt({ reduced }: { reduced: boolean }) {
  return (
    <>
      {[48, 78, 108, 138].map((y) => <path key={y} d={`M28 ${y} H332`} stroke="var(--border-strong)" strokeOpacity="0.42" strokeWidth="1" strokeDasharray="2 7" />)}
      <path d="M36 139 V39 M36 139 H330" stroke="var(--border-strong)" strokeOpacity="0.62" strokeWidth="1.1" />
      <Line d="M38 117 C65 112 69 80 100 87 S137 122 165 101 S207 52 235 72 S281 118 329 57" color="var(--brand-teal)" width={2.4} opacity={0.88} reduced={reduced} />
      {[[100, 87], [165, 101], [235, 72], [329, 57]].map(([cx, cy], index) => <Pulse key={`${cx}-${cy}`} cx={cx} cy={cy} color={index === 2 ? "var(--brand-orange)" : "var(--brand-green)"} delay={index * 0.55} reduced={reduced} />)}
      <motion.circle
        r="3.3"
        fill="var(--brand-orange)"
        initial={false}
        animate={reduced ? { cx: 38, cy: 117 } : { cx: [38, 100, 165, 235, 329], cy: [117, 87, 101, 72, 57] }}
        transition={reduced ? { duration: 0 } : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function ApiArt({ reduced }: { reduced: boolean }) {
  return (
    <>
      <Line d="M50 88 H146 C164 88 163 60 184 60 H251 C272 60 269 104 291 104 H326" color="var(--brand-teal)" width={2} opacity={0.65} reduced={reduced} />
      <Line d="M50 112 H131 C152 112 150 137 176 137 H248" color="var(--brand-sand)" opacity={0.72} delay={0.16} reduced={reduced} />
      <rect x="25" y="72" width="54" height="50" rx="11" fill="var(--surface)" stroke="var(--border-strong)" />
      <rect x="153" y="42" width="67" height="64" rx="14" fill="var(--surface)" stroke="var(--brand-teal)" strokeOpacity="0.62" />
      <rect x="286" y="83" width="50" height="43" rx="11" fill="var(--surface)" stroke="var(--border-strong)" />
      <circle cx="48" cy="91" r="3" fill="var(--brand-green)" />
      <circle cx="61" cy="91" r="3" fill="var(--brand-sand)" />
      <path d="M37 104 H67 M37 111 H58" stroke="var(--brand-navy)" strokeOpacity="0.34" strokeWidth="2" strokeLinecap="round" />
      <circle cx="186" cy="61" r="8" fill="var(--brand-teal)" fillOpacity="0.15" />
      <circle cx="186" cy="61" r="3" fill="var(--brand-teal)" />
      <path d="M174 78 H200 M174 86 H200" stroke="var(--border-strong)" strokeWidth="2" strokeLinecap="round" />
      <path d="M298 98 H324 M298 106 H318" stroke="var(--brand-green)" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      <motion.circle cx="53" cy="88" r="3.4" fill="var(--brand-orange)" initial={false} animate={reduced ? { x: 0, y: 0, opacity: 0.9 } : { x: [0, 80, 136, 230], y: [0, -26, 16, 16], opacity: [0.35, 1, 1, 0.35] }} transition={reduced ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: "easeInOut" }} />
    </>
  );
}

function DocsArt({ reduced }: { reduced: boolean }) {
  return (
    <>
      <rect x="74" y="36" width="173" height="105" rx="9" fill="var(--brand-sand)" fillOpacity="0.14" stroke="var(--brand-sand)" strokeOpacity="0.54" />
      <rect x="92" y="27" width="173" height="105" rx="9" fill="var(--surface)" stroke="var(--border-strong)" />
      <rect x="109" y="42" width="53" height="7" rx="3.5" fill="var(--brand-green)" fillOpacity="0.58" />
      <path d="M109 64 H246 M109 75 H232 M109 86 H242 M109 109 H180" stroke="var(--border-strong)" strokeOpacity="0.62" strokeWidth="3" strokeLinecap="round" />
      <circle cx="104" cy="64" r="2" fill="var(--brand-orange)" />
      <circle cx="104" cy="75" r="2" fill="var(--brand-teal)" />
      <circle cx="104" cy="86" r="2" fill="var(--brand-green)" />
      <motion.path d="M101 99 H250" stroke="var(--brand-orange)" strokeOpacity="0.8" strokeWidth="1.5" initial={false} animate={reduced ? { opacity: 0.55 } : { y: [0, 13, 0], opacity: [0.15, 0.75, 0.15] }} transition={reduced ? { duration: 0 } : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }} />
      <Pulse cx={288} cy={54} color="var(--brand-teal)" delay={0.3} reduced={reduced} />
      <Pulse cx={292} cy={119} delay={1.1} reduced={reduced} />
    </>
  );
}

function ServicesArt({ reduced }: { reduced: boolean }) {
  const bars = [{ x: 39, h: 50, y: 79 }, { x: 132, h: 77, y: 52 }, { x: 225, h: 63, y: 66 }];
  return (
    <>
      <Line d="M91 104 H129 M184 91 H222 M278 98 H320" color="var(--brand-teal)" width={1.7} opacity={0.7} reduced={reduced} />
      {bars.map((bar, index) => (
        <g key={bar.x}>
          <rect x={bar.x} y={bar.y} width="56" height={bar.h} rx="12" fill="var(--surface)" stroke={index === 1 ? "var(--brand-green)" : "var(--border-strong)"} strokeOpacity="0.85" />
          <rect x={bar.x + 12} y={bar.y + 13} width="32" height="5" rx="2.5" fill={index === 1 ? "var(--brand-green)" : "var(--brand-teal)"} fillOpacity="0.55" />
          <path d={`M${bar.x + 13} ${bar.y + 29} H${bar.x + 42} M${bar.x + 13} ${bar.y + 37} H${bar.x + 35}`} stroke="var(--border-strong)" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <motion.circle cx="38" cy="104" r="3.2" fill="var(--brand-orange)" initial={false} animate={reduced ? { x: 0, opacity: 0.9 } : { x: [0, 104, 197, 285], opacity: [0.2, 1, 1, 0.2] }} transition={reduced ? { duration: 0 } : { duration: 6, repeat: Infinity, ease: "easeInOut" }} />
    </>
  );
}

function NetworkArt({ reduced }: { reduced: boolean }) {
  const nodes = [[66, 111], [126, 62], [183, 102], [232, 48], [294, 83], [267, 132]] as const;
  const links = [[66, 111, 126, 62], [126, 62, 183, 102], [183, 102, 232, 48], [232, 48, 294, 83], [294, 83, 267, 132], [66, 111, 183, 102], [183, 102, 267, 132]] as const;
  return (
    <>
      {links.map(([x1, y1, x2, y2]) => <path key={`${x1}-${y1}-${x2}-${y2}`} d={`M${x1} ${y1} L${x2} ${y2}`} stroke="var(--brand-teal)" strokeOpacity="0.38" strokeWidth="1.3" />)}
      {nodes.map(([cx, cy], index) => <Pulse key={`${cx}-${cy}`} cx={cx} cy={cy} color={index % 2 ? "var(--brand-green)" : "var(--brand-orange)"} delay={index * 0.28} reduced={reduced} />)}
      <motion.circle cx="66" cy="111" r="2.8" fill="var(--brand-navy)" initial={false} animate={reduced ? { cx: 66, cy: 111 } : { cx: [66, 126, 183, 232, 294, 267, 183, 66], cy: [111, 62, 102, 48, 83, 132, 102, 111] }} transition={reduced ? { duration: 0 } : { duration: 11, repeat: Infinity, ease: "easeInOut" }} />
    </>
  );
}

function ProjectsArt({ reduced }: { reduced: boolean }) {
  const points = [54, 122, 190, 258, 326];
  return (
    <>
      <path d="M38 93 H326" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M38 93 H326" stroke="var(--brand-green)" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 7" />
      {points.map((cx, index) => (
        <g key={cx}>
          <circle cx={cx} cy="93" r={index === 2 ? 9 : 6} fill="var(--surface)" stroke={index === 2 ? "var(--brand-teal)" : "var(--brand-sand)"} strokeWidth="2" />
          <path d={`M${cx} 84 V${index % 2 ? 61 : 125}`} stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="2 4" />
        </g>
      ))}
      <motion.circle cy="93" r="4" fill="var(--brand-orange)" initial={false} animate={reduced ? { cx: 54 } : { cx: points }} transition={reduced ? { duration: 0 } : { duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <Pulse cx={190} cy={93} color="var(--brand-teal)" delay={0.4} reduced={reduced} />
    </>
  );
}

function FaqArt({ reduced }: { reduced: boolean }) {
  return (
    <>
      <Line d="M180 80 C145 80 131 58 106 58 M180 80 C215 80 229 58 254 58 M180 91 C142 91 124 121 92 121 M180 91 C218 91 236 121 268 121" color="var(--brand-sand)" opacity={0.8} reduced={reduced} />
      <circle cx="180" cy="86" r="21" fill="var(--brand-green)" fillOpacity="0.12" stroke="var(--brand-green)" strokeOpacity="0.55" />
      <circle cx="180" cy="82" r="4" fill="var(--brand-green)" />
      <path d="M180 89 V94" stroke="var(--brand-green)" strokeWidth="2.5" strokeLinecap="round" />
      {[[106, 58], [254, 58], [92, 121], [268, 121]].map(([cx, cy], index) => (
        <g key={`${cx}-${cy}`}>
          <rect x={cx - 19} y={cy - 13} width="38" height="26" rx="8" fill="var(--surface)" stroke="var(--border-strong)" />
          <circle cx={cx} cy={cy} r="3" fill={index % 2 ? "var(--brand-teal)" : "var(--brand-orange)"} />
        </g>
      ))}
      <Pulse cx={180} cy={86} delay={0.5} reduced={reduced} />
    </>
  );
}

function ContactArt({ reduced }: { reduced: boolean }) {
  return (
    <>
      <path d="M180 34 V142 M126 88 H234" stroke="var(--border-strong)" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="3 6" />
      {[18, 36, 56].map((r, index) => (
        <motion.circle
          key={r}
          cx="180"
          cy="88"
          r={r}
          fill="none"
          stroke={index === 1 ? "var(--brand-teal)" : "var(--brand-green)"}
          strokeOpacity="0.46"
          strokeWidth="1.2"
          initial={false}
          animate={reduced ? { opacity: 0.38, scale: 1 } : { opacity: [0.12, 0.48, 0.12], scale: [0.9, 1.06, 0.9] }}
          transition={reduced ? { duration: 0 } : { duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.7 }}
          style={{ transformOrigin: "180px 88px" }}
        />
      ))}
      <circle cx="180" cy="88" r="5" fill="var(--brand-orange)" />
      <Pulse cx={180} cy={88} delay={0.2} reduced={reduced} />
      <path d="M65 51 H112 M248 126 H302" stroke="var(--brand-sand)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="65" cy="51" r="2" fill="var(--brand-sand)" />
      <circle cx="302" cy="126" r="2" fill="var(--brand-sand)" />
    </>
  );
}

function NotFoundArt({ reduced }: { reduced: boolean }) {
  return (
    <>
      <circle cx="177" cy="88" r="48" fill="none" stroke="var(--brand-teal)" strokeOpacity="0.52" strokeWidth="1.5" />
      <circle cx="177" cy="88" r="34" fill="none" stroke="var(--brand-sand)" strokeOpacity="0.65" strokeWidth="1" strokeDasharray="2 7" />
      <motion.path
        d="M177 50 L184 88 L177 126 L170 88 Z"
        fill="var(--brand-green)"
        fillOpacity="0.48"
        stroke="var(--brand-green)"
        strokeOpacity="0.75"
        strokeWidth="1"
        initial={false}
        animate={reduced ? { rotate: 0 } : { rotate: 360 }}
        transition={reduced ? { duration: 0 } : { duration: 34, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "177px 88px" }}
      />
      <circle cx="177" cy="88" r="4" fill="var(--brand-orange)" />
      <path d="M177 26 V38 M177 138 V150 M115 88 H127 M227 88 H239" stroke="var(--border-strong)" strokeWidth="1.2" strokeLinecap="round" />
      <Pulse cx={264} cy={57} color="var(--brand-teal)" delay={0.4} reduced={reduced} />
      <Pulse cx={86} cy={122} delay={1} reduced={reduced} />
    </>
  );
}

const landscapes: Record<Habitat, { terrain: string[]; water: string[]; points: [number, number][] }> = {
  danube: {
    terrain: ["M18 62 C66 55 91 71 129 65 S202 54 239 64 S307 72 342 58", "M18 136 C63 126 94 143 131 136 S203 124 242 138 S307 144 342 127"],
    water: ["M18 99 C54 78 76 119 110 99 S166 81 193 101 S244 121 270 99 S318 79 342 96"],
    points: [[83, 99], [193, 101], [294, 91]],
  },
  coast: {
    terrain: ["M18 59 C68 75 98 53 145 70 S227 83 267 67 S317 61 342 74", "M18 47 C68 63 98 41 145 58 S227 71 267 55 S317 49 342 62"],
    water: ["M18 106 C48 93 76 119 108 105 S169 95 200 108 S260 119 291 105 S326 98 342 104", "M18 123 C48 110 76 136 108 122 S169 112 200 125 S260 136 291 122 S326 115 342 121"],
    points: [[96, 106], [215, 111], [300, 105]],
  },
  mountain: {
    terrain: ["M22 132 L87 62 L121 95 L177 43 L222 93 L263 54 L340 132", "M39 141 C93 122 116 128 164 119 S247 121 324 137"],
    water: ["M55 148 C104 137 137 151 176 142 S258 143 313 151"],
    points: [[87, 62], [177, 43], [263, 54]],
  },
  gorge: {
    terrain: ["M20 45 C61 68 70 105 101 130 S150 145 181 122 S234 76 261 56 S314 48 342 75", "M20 60 C57 81 71 115 102 139 S153 154 183 132 S236 91 265 72 S315 64 342 90"],
    water: ["M21 127 C85 110 122 104 176 110 S270 118 340 99"],
    points: [[100, 130], [181, 110], [263, 101]],
  },
  wetland: {
    terrain: ["M18 57 C71 64 87 53 133 60 S209 64 250 55 S313 60 342 51", "M18 140 C65 130 94 144 135 137 S207 131 249 140 S312 133 342 141"],
    water: ["M28 95 C63 78 84 113 119 95 S174 79 208 97 S264 117 297 96 S326 84 338 92", "M84 46 C75 71 74 82 79 106", "M244 75 C260 93 272 110 282 133"],
    points: [[79, 96], [208, 97], [282, 115]],
  },
  islands: {
    terrain: ["M18 54 C72 66 97 52 141 64 S222 72 258 59 S316 68 342 57", "M18 137 C71 127 98 144 143 135 S219 128 260 140 S314 132 342 141"],
    water: ["M18 96 C57 77 82 114 118 96 S179 78 212 97 S270 118 302 97 S328 86 342 92", "M129 49 C145 70 152 82 155 103", "M239 82 C227 99 221 111 219 131"],
    points: [[111, 96], [155, 94], [252, 99]],
  },
  watershed: {
    terrain: ["M20 47 C81 64 111 52 155 64 S241 76 340 54", "M21 143 C80 127 108 143 158 132 S245 124 339 143"],
    water: ["M35 53 C78 67 108 84 180 103", "M67 138 C103 122 129 113 180 103", "M328 57 C278 76 237 91 180 103", "M326 138 C272 123 236 113 180 103"],
    points: [[78, 67], [106, 122], [265, 81], [268, 123], [180, 103]],
  },
  alpine: {
    terrain: ["M22 133 L76 78 L104 96 L160 42 L206 90 L242 62 L340 135", "M44 142 C95 128 118 136 158 124 S234 129 315 141"],
    water: ["M82 117 C103 108 120 106 140 111", "M224 109 C247 102 270 106 291 115"],
    points: [[76, 78], [160, 42], [242, 62]],
  },
  volcanic: {
    terrain: ["M23 136 C66 125 94 105 126 76 C146 57 154 48 180 47 C205 48 214 60 234 83 C260 111 292 129 338 136", "M55 143 C113 131 142 119 180 118 S249 133 306 143"],
    water: ["M145 54 C157 61 166 64 180 64 C194 64 204 60 216 54"],
    points: [[126, 76], [180, 47], [234, 83]],
  },
  glacial: {
    terrain: ["M20 132 L82 73 L117 103 L172 44 L218 91 L262 56 L340 133", "M41 142 C94 126 121 137 164 125 S243 129 320 140"],
    water: ["M116 115 C133 105 151 106 165 115 C154 128 132 131 116 115 Z", "M229 115 C247 105 268 109 281 118 C267 129 244 130 229 115 Z"],
    points: [[82, 73], [172, 44], [262, 56]],
  },
};

function LandscapeArt({ habitat, reduced }: { habitat: Habitat; reduced: boolean }) {
  const scene = landscapes[habitat];
  return (
    <>
      {scene.terrain.map((d, index) => <Line key={`terrain-${index}`} d={d} color="var(--brand-sand)" opacity={0.82} delay={index * 0.12} reduced={reduced} />)}
      {scene.water.map((d, index) => <Line key={`water-${index}`} d={d} color="var(--brand-teal)" width={index === 0 ? 1.9 : 1.3} opacity={0.78} delay={0.18 + index * 0.12} reduced={reduced} />)}
      {scene.points.map(([cx, cy], index) => <Pulse key={`${cx}-${cy}`} cx={cx} cy={cy} color={index === 1 ? "var(--brand-orange)" : "var(--brand-green)"} delay={index * 0.42} reduced={reduced} />)}
    </>
  );
}

function SceneArt({ scene, reduced }: { scene: PageMotionScene; reduced: boolean }) {
  if (scene.kind === "landscape") return <LandscapeArt habitat={scene.habitat} reduced={reduced} />;
  switch (scene.kind) {
    case "about": return <AboutArt reduced={reduced} />;
    case "infrastructure": return <InfrastructureArt reduced={reduced} />;
    case "platforms": return <PlatformsArt reduced={reduced} />;
    case "data": return <DataArt reduced={reduced} />;
    case "api": return <ApiArt reduced={reduced} />;
    case "docs": return <DocsArt reduced={reduced} />;
    case "services": return <ServicesArt reduced={reduced} />;
    case "network": return <NetworkArt reduced={reduced} />;
    case "projects": return <ProjectsArt reduced={reduced} />;
    case "faq": return <FaqArt reduced={reduced} />;
    case "contact": return <ContactArt reduced={reduced} />;
    case "not-found": return <NotFoundArt reduced={reduced} />;
  }
  return <NotFoundArt reduced={reduced} />;
}

export function PageMotionGraphic({ scene, className }: { scene: PageMotionScene; className?: string }) {
  const reduced = useReducedMotion() === true;
  return (
    <div
      aria-hidden="true"
      className={cn("relative isolate aspect-[2.05/1] min-h-[132px] overflow-hidden rounded-[18px] border border-border bg-surface-2 shadow-card", className)}
      style={{ background: "radial-gradient(ellipse at 72% 22%, var(--surface) 0%, var(--surface-2) 64%, var(--background) 100%)" }}
    >
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <svg viewBox="0 0 360 176" className="absolute inset-0 size-full" aria-hidden="true">
        <SceneArt scene={scene} reduced={reduced} />
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-background/20 to-transparent" />
    </div>
  );
}
