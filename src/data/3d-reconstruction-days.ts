/* 3D Reconstruction: each day is one stop along the reconstruction pipeline.
   A day is a run of steps in the order I worked them out. */

export const STAGES = [
  "Features",
  "Matching",
  "Two-view geometry",
  "Triangulation",
  "Structure from motion",
  "Bundle adjustment",
  "Dense reconstruction",
];

export type Block =
  | { kind: "board"; lines: string[] }                      // notes, as a list
  | { kind: "ai"; lines: string[] }                         // more notes, same style
  | { kind: "eq"; tex: string; source?: "ai" }              // display maths
  | { kind: "table"; headers: string[]; rows: string[][]; source?: "ai" }
  | { kind: "question"; text: string }                      // a question I had
  | { kind: "figure"; svg: string; caption?: string }       
  | { kind: "tangent"; title: string; blocks: Block[] }     // a deep-dive, collapsed
  | { kind: "explain"; paras: string[] }                   // theory and intuition, as prose
  | { kind: "p"; text: string }
  | { kind: "html"; html: string };

export interface Step {
  n: number;
  act: string;
  title: string;
  subtitle?: string;
  blocks: Block[];
}

export interface Day {
  day: number;
  date: string;
  curiosityTitle: string;
  summary: string;
  bullets: string[];
  intro?: Block[];       // shown under the title
  stages: number[];      // indexes into STAGES this day covers
  steps: Step[];
  questions: string[];   // not answered yet
}

export const experiment = {
  title: "3D Reconstruction",
  status: "active" as const,
  startDate: "2026-11-03",
  description: "Geometry-based 3D reconstruction from images: camera models, epipolar geometry, triangulation and structure from motion.",
};

export const days: Day[] = [
  {
    "day": 1,
    "intro": [
      {
        "kind": "tangent",
        "title": "What is SIFT, anyway?",
        "blocks": [
          {
            "kind": "p",
            "text": "<strong>SIFT</strong>, the Scale-Invariant Feature Transform, is David Lowe's method for finding distinctive points in an image and describing them so the same points can be found again in another image. First published at ICCV in 1999, then in full in 2004 as <em>Distinctive Image Features from Scale-Invariant Keypoints</em>, one of the most cited papers in computer vision."
          },
          {
            "kind": "p",
            "text": "<strong>What goes in, what comes out.</strong> In: a greyscale image. Out: a few hundred to a few thousand <em>keypoints</em>, each with a position $(x, y)$, a size $\\sigma$, an orientation $\\theta$, and a 128-number descriptor. Two keypoints from different photos with nearby descriptors are probably the same physical point."
          },
          {
            "kind": "p",
            "text": "<strong>Why it mattered.</strong> Before SIFT, corner detectors like Harris found points well but couldn't say how big they were, so matching broke as soon as the camera moved closer or further. SIFT made points survive changes of scale, rotation and lighting, and tolerate moderate changes of viewpoint, which is what real photo collections need."
          },
          {
            "kind": "p",
            "text": "<strong>Where it went.</strong> It powered panorama stitching, object recognition and, for reconstruction, Photo Tourism (2006), the system that rebuilt landmarks in 3D from internet photos. COLMAP, today's standard structure-from-motion tool, still uses SIFT by default. Its ideas live on in HOG (gradient histograms for pedestrian detection), faster cousins like SURF and ORB, and the learned detectors that replaced it on benchmarks."
          },
          {
            "kind": "p",
            "text": "<strong>The patent.</strong> The University of British Columbia held a patent on SIFT, which kept it out of OpenCV's main library for years. It expired in March 2020, and SIFT moved into OpenCV's main module in version 4.4 as <code>cv2.SIFT_create()</code>."
          }
        ]
      }
    ],
    "date": "2026-11-06",
    "curiosityTitle": "SIFT: detecting and matching keypoints across images",
    "summary": "Before any geometry, two photos have to agree on landmarks: this speck here is that speck there. SIFT finds points that survive zooming, turning and changes of light, and gives each a 128-number fingerprint.",
    "bullets": [
      "SIFT, step by step."
    ],
    "stages": [
      0,
      1
    ],
    "steps": [
      {
        "n": 1,
        "act": "Scale",
        "title": "Creating Gaussian spaces",
        "subtitle": "At different levels and scales",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Create Gaussian spaces at different levels and scales"
            ]
          },
          {
            "kind": "eq",
            "tex": "L(x, y, \\sigma) = G(x, y, \\sigma) * I(x, y), \\qquad G = \\frac{1}{2\\pi\\sigma^2}\\, e^{-(x^2+y^2)/2\\sigma^2}",
            "source": "ai"
          },
          {
            "kind": "explain",
            "paras": [
              "Think of the image as a landscape of brightness. Blurring it with a Gaussian of size $\\sigma$ is like looking through fog that hides anything smaller than about $\\sigma$. Sweep $\\sigma$ upwards and you get a film: fine texture melts first, then small blobs, then bigger ones, until only broad shading is left. Stack the frames and you have <strong>scale space</strong>, a 3D volume $L(x, y, \\sigma)$.",
              "<strong>Why a Gaussian and not any blur?</strong> Scale-space theory (Witkin, Koenderink, Lindeberg) shows that the Gaussian is the <em>only</em> kernel that is linear, treats every position and direction the same, and never creates new structure as $\\sigma$ grows. A box blur can make ripples appear out of nothing. The Gaussian only ever destroys detail, so a blob found at a coarse scale is really in the image, not an artefact of the blur.",
              "<strong>Blurring is diffusion.</strong> $L$ obeys the heat equation, $\\partial L / \\partial \\sigma = \\sigma \\nabla^2 L$: brightness spreads from bright pixels to dark ones like heat. Diffusion changes each point by its Laplacian, how different it is from the average of its neighbours. So the difference between two moments of the diffusion, the DoG, is (to first order) the Laplacian. That's not a coincidence, it's the same equation.",
              "<strong>Why the $\\sigma^2$?</strong> Blurring flattens everything, so derivatives of $L$ shrink as $\\sigma$ grows. Raw Laplacian responses at coarse scales would always lose to fine ones. Multiplying by $\\sigma^2$ cancels that exactly and puts every scale on equal footing. DoG gets the $\\sigma^2$ for free from the heat equation, which is why it can be compared across levels without any correction.",
              "<strong>Characteristic scale, intuitively:</strong> take a dark disc of radius $r$. The normalised Laplacian at its centre is strongest when $\\sigma = r/\\sqrt{2}$. Photograph it from half the distance and $r$ doubles, so the peak moves to $2\\sigma$. The peak follows the object. That is the whole of scale invariance in one sentence."
            ]
          },
          {
            "kind": "tangent",
            "title": "What is the Laplacian, really?",
            "blocks": [
              {
                "kind": "p",
                "text": "Short version: the Laplacian at a point measures <strong>how different that point is from the average of its neighbours</strong>. That's it. Everything else, the blobs, the edges, the heat, follows from that one sentence. Here's how."
              },
              {
                "kind": "p",
                "text": "<strong>Start in one dimension.</strong> Take a row of pixels with brightness $f(x)$. The first derivative $f'$ is the slope: how fast brightness changes as you walk along. The second derivative $f''$ is how fast the <em>slope</em> changes: the <strong>curvature</strong>. Positive $f''$ means the curve bends upwards like a bowl; negative means it bends down like a dome; zero means it's straight."
              },
              {
                "kind": "p",
                "text": "On a grid you can't take a true derivative, so you take differences. The slope between neighbours is $f(x{+}1) - f(x)$. The change in slope is the difference of two of those:"
              },
              {
                "kind": "eq",
                "tex": "f''(x) \\approx \\big[f(x{+}1) - f(x)\\big] - \\big[f(x) - f(x{-}1)\\big] = f(x{-}1) - 2f(x) + f(x{+}1)",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "Rearrange it and the meaning jumps out:"
              },
              {
                "kind": "eq",
                "tex": "f''(x) \\approx 2\\left[\\frac{f(x{-}1) + f(x{+}1)}{2} - f(x)\\right] = 2\\,(\\text{neighbours' average} - \\text{me})",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "So the second derivative is literally <em>the average of my neighbours minus me</em>, times two. If I'm darker than my surroundings, it's positive. If I'm brighter, it's negative. If I'm exactly in line with them, it's zero."
              },
              {
                "kind": "p",
                "text": "<strong>Try it on numbers.</strong> Run the kernel $[1, -2, 1]$ along a few rows:"
              },
              {
                "kind": "table",
                "headers": [
                  "Signal",
                  "Values",
                  "Laplacian (middle)",
                  "Reading"
                ],
                "rows": [
                  [
                    "flat",
                    "5, 5, 5",
                    "5 − 10 + 5 = 0",
                    "nothing here"
                  ],
                  [
                    "ramp",
                    "2, 4, 6",
                    "2 − 8 + 6 = 0",
                    "a steady slope is not interesting"
                  ],
                  [
                    "bright spot",
                    "2, 9, 2",
                    "2 − 18 + 2 = −14",
                    "brighter than surroundings"
                  ],
                  [
                    "dark spot",
                    "8, 1, 8",
                    "8 − 2 + 8 = +14",
                    "darker than surroundings"
                  ],
                  [
                    "corner of a step",
                    "2, 2, 8",
                    "2 − 4 + 8 = +6",
                    "foot of the edge"
                  ],
                  [
                    "top of the step",
                    "2, 8, 8",
                    "2 − 16 + 8 = −6",
                    "shoulder of the edge"
                  ]
                ],
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "Two things to notice. First, <strong>a ramp gives zero</strong>. The first derivative would shout about a ramp; the Laplacian ignores it, because every point on a straight slope is exactly the average of its neighbours. That's why it's good for finding <em>things</em> (spots, blobs) rather than gentle shading. Second, <strong>an edge gives a pair</strong>: positive at the foot, negative at the shoulder, crossing zero right on the edge."
              },
              {
                "kind": "figure",
                "svg": "<svg viewBox=\"0 0 600 290\" role=\"img\" aria-label=\"A brightness profile with a flat part, a ramp, a bright spot and an edge, and below it the Laplacian: zero on the flat part and along the ramp, a deep dip at the spot, and a plus-minus pair at the edge\"><text x=\"20\" y=\"16\" class=\"fig-label\">brightness, blurred</text><polyline points=\"20.0,96.0 20.9,96.0 21.9,96.0 22.8,96.0 23.7,96.0 24.7,96.0 25.6,96.0 26.5,96.0 27.5,96.0 28.4,96.0 29.3,96.0 30.3,96.0 31.2,96.0 32.1,96.0 33.1,96.0 34.0,96.0 34.9,96.0 35.9,96.0 36.8,96.0 37.7,96.0 38.7,96.0 39.6,96.0 40.5,96.0 41.5,96.0 42.4,96.0 43.3,96.0 44.3,96.0 45.2,96.0 46.1,96.0 47.1,96.0 48.0,96.0 48.9,96.0 49.9,96.0 50.8,96.0 51.7,96.0 52.7,96.0 53.6,96.0 54.5,96.0 55.5,96.0 56.4,96.0 57.3,96.0 58.3,96.0 59.2,96.0 60.1,96.0 61.1,96.0 62.0,96.0 62.9,96.0 63.9,96.0 64.8,96.0 65.7,96.0 66.7,96.0 67.6,96.0 68.5,96.0 69.5,96.0 70.4,96.0 71.3,96.0 72.3,96.0 73.2,96.0 74.1,96.0 75.1,96.0 76.0,96.0 76.9,96.0 77.9,96.0 78.8,96.0 79.7,96.0 80.7,96.0 81.6,96.0 82.5,96.0 83.5,96.0 84.4,96.0 85.3,95.9 86.3,95.9 87.2,95.9 88.1,95.8 89.1,95.8 90.0,95.7 90.9,95.6 91.9,95.4 92.8,95.3 93.7,95.1 94.7,94.9 95.6,94.6 96.5,94.3 97.5,94.0 98.4,93.7 99.3,93.3 100.3,92.9 101.2,92.5 102.1,92.0 103.1,91.6 104.0,91.1 104.9,90.7 105.9,90.2 106.8,89.7 107.7,89.3 108.7,88.8 109.6,88.3 110.5,87.8 111.5,87.4 112.4,86.9 113.3,86.4 114.3,85.9 115.2,85.4 116.1,85.0 117.1,84.5 118.0,84.0 118.9,83.5 119.9,83.0 120.8,82.6 121.7,82.1 122.7,81.6 123.6,81.1 124.5,80.6 125.5,80.2 126.4,79.7 127.3,79.2 128.3,78.7 129.2,78.2 130.1,77.8 131.1,77.3 132.0,76.8 132.9,76.3 133.9,75.8 134.8,75.4 135.7,74.9 136.7,74.4 137.6,73.9 138.5,73.4 139.5,73.0 140.4,72.5 141.3,72.0 142.3,71.5 143.2,71.0 144.1,70.6 145.1,70.1 146.0,69.6 146.9,69.1 147.9,68.6 148.8,68.2 149.7,67.7 150.7,67.2 151.6,66.7 152.5,66.2 153.5,65.8 154.4,65.3 155.3,64.8 156.3,64.3 157.2,63.8 158.1,63.4 159.1,62.9 160.0,62.4 160.9,61.9 161.9,61.4 162.8,61.0 163.7,60.5 164.7,60.0 165.6,59.5 166.5,59.0 167.5,58.6 168.4,58.1 169.3,57.6 170.3,57.1 171.2,56.6 172.1,56.2 173.1,55.7 174.0,55.2 174.9,54.7 175.9,54.3 176.8,53.8 177.7,53.3 178.7,52.9 179.6,52.4 180.5,52.0 181.5,51.5 182.4,51.1 183.3,50.7 184.3,50.3 185.2,50.0 186.1,49.7 187.1,49.4 188.0,49.1 188.9,48.9 189.9,48.7 190.8,48.6 191.7,48.4 192.7,48.3 193.6,48.2 194.5,48.2 195.5,48.1 196.4,48.1 197.3,48.1 198.3,48.0 199.2,48.0 200.1,48.0 201.1,48.0 202.0,48.0 202.9,48.0 203.9,48.0 204.8,48.0 205.7,48.0 206.7,48.0 207.6,48.0 208.5,48.0 209.5,48.0 210.4,48.0 211.3,48.0 212.3,48.0 213.2,48.0 214.1,48.0 215.1,48.0 216.0,48.0 216.9,48.0 217.9,48.0 218.8,48.0 219.7,48.0 220.7,48.0 221.6,48.0 222.5,48.0 223.5,48.0 224.4,48.0 225.3,48.0 226.3,48.0 227.2,48.0 228.1,48.0 229.1,48.0 230.0,48.0 230.9,48.0 231.9,48.0 232.8,48.0 233.7,48.0 234.7,48.0 235.6,48.0 236.5,48.0 237.5,48.0 238.4,48.0 239.3,48.0 240.3,48.0 241.2,48.0 242.1,48.0 243.1,48.0 244.0,48.0 244.9,48.0 245.9,48.0 246.8,48.0 247.7,48.0 248.7,48.0 249.6,48.0 250.5,48.0 251.5,48.0 252.4,48.0 253.3,48.0 254.3,48.0 255.2,47.9 256.1,47.9 257.1,47.9 258.0,47.9 258.9,47.8 259.9,47.8 260.8,47.7 261.7,47.7 262.7,47.6 263.6,47.5 264.5,47.3 265.5,47.2 266.4,47.0 267.3,46.8 268.3,46.5 269.2,46.2 270.1,45.8 271.1,45.4 272.0,44.9 272.9,44.4 273.9,43.8 274.8,43.1 275.7,42.3 276.7,41.4 277.6,40.4 278.5,39.4 279.5,38.2 280.4,37.0 281.3,35.7 282.3,34.2 283.2,32.7 284.1,31.2 285.1,29.6 286.0,27.9 286.9,26.2 287.9,24.5 288.8,22.8 289.7,21.1 290.7,19.5 291.6,18.0 292.5,16.5 293.5,15.2 294.4,14.0 295.3,12.9 296.3,12.0 297.2,11.3 298.1,10.8 299.1,10.5 300.0,10.4 300.9,10.5 301.9,10.8 302.8,11.3 303.7,12.0 304.7,12.9 305.6,14.0 306.5,15.2 307.5,16.5 308.4,18.0 309.3,19.5 310.3,21.1 311.2,22.8 312.1,24.5 313.1,26.2 314.0,27.9 314.9,29.6 315.9,31.2 316.8,32.7 317.7,34.2 318.7,35.7 319.6,37.0 320.5,38.2 321.5,39.4 322.4,40.4 323.3,41.4 324.3,42.3 325.2,43.1 326.1,43.8 327.1,44.4 328.0,44.9 328.9,45.4 329.9,45.8 330.8,46.2 331.7,46.5 332.7,46.8 333.6,47.0 334.5,47.2 335.5,47.3 336.4,47.5 337.3,47.6 338.3,47.7 339.2,47.7 340.1,47.8 341.1,47.8 342.0,47.9 342.9,47.9 343.9,47.9 344.8,47.9 345.7,48.0 346.7,48.0 347.6,48.0 348.5,48.0 349.5,48.0 350.4,48.0 351.3,48.0 352.3,48.0 353.2,48.0 354.1,48.0 355.1,48.0 356.0,48.0 356.9,48.0 357.9,48.0 358.8,48.0 359.7,48.0 360.7,48.0 361.6,48.0 362.5,48.0 363.5,48.0 364.4,48.0 365.3,48.0 366.3,48.0 367.2,48.0 368.1,48.0 369.1,48.0 370.0,48.0 370.9,48.0 371.9,48.0 372.8,48.0 373.7,48.0 374.7,48.0 375.6,48.0 376.5,48.0 377.5,48.0 378.4,48.0 379.3,48.0 380.3,48.0 381.2,48.0 382.1,48.0 383.1,48.0 384.0,48.0 384.9,48.0 385.9,48.0 386.8,48.0 387.7,48.0 388.7,48.0 389.6,48.0 390.5,48.0 391.5,48.0 392.4,48.0 393.3,48.0 394.3,48.0 395.2,48.0 396.1,48.0 397.1,48.0 398.0,48.0 398.9,48.0 399.9,48.0 400.8,48.0 401.7,48.0 402.7,48.0 403.6,48.0 404.5,48.0 405.5,48.0 406.4,48.0 407.3,48.0 408.3,48.0 409.2,48.0 410.1,48.0 411.1,48.0 412.0,48.0 412.9,48.0 413.9,48.0 414.8,48.0 415.7,48.0 416.7,48.0 417.6,48.0 418.5,48.0 419.5,48.0 420.4,48.0 421.3,48.0 422.3,48.0 423.2,48.0 424.1,48.0 425.1,48.0 426.0,48.0 426.9,48.0 427.9,48.0 428.8,48.0 429.7,48.0 430.7,48.0 431.6,48.0 432.5,48.0 433.5,48.0 434.4,48.1 435.3,48.1 436.3,48.1 437.2,48.1 438.1,48.2 439.1,48.3 440.0,48.4 440.9,48.5 441.9,48.7 442.8,48.9 443.7,49.2 444.7,49.5 445.6,50.0 446.5,50.5 447.5,51.2 448.4,52.0 449.3,53.0 450.3,54.2 451.2,55.5 452.1,57.1 453.1,58.8 454.0,60.7 454.9,62.7 455.9,64.9 456.8,67.2 457.7,69.6 458.7,72.0 459.6,74.4 460.5,76.8 461.5,79.1 462.4,81.3 463.3,83.3 464.3,85.2 465.2,86.9 466.1,88.5 467.1,89.8 468.0,91.0 468.9,92.0 469.9,92.8 470.8,93.5 471.7,94.0 472.7,94.5 473.6,94.8 474.5,95.1 475.5,95.3 476.4,95.5 477.3,95.6 478.3,95.7 479.2,95.8 480.1,95.9 481.1,95.9 482.0,95.9 482.9,95.9 483.9,96.0 484.8,96.0 485.7,96.0 486.7,96.0 487.6,96.0 488.5,96.0 489.5,96.0 490.4,96.0 491.3,96.0 492.3,96.0 493.2,96.0 494.1,96.0 495.1,96.0 496.0,96.0 496.9,96.0 497.9,96.0 498.8,96.0 499.7,96.0 500.7,96.0 501.6,96.0 502.5,96.0 503.5,96.0 504.4,96.0 505.3,96.0 506.3,96.0 507.2,96.0 508.1,96.0 509.1,96.0 510.0,96.0 510.9,96.0 511.9,96.0 512.8,96.0 513.7,96.0 514.7,96.0 515.6,96.0 516.5,96.0 517.5,96.0 518.4,96.0 519.3,96.0 520.3,96.0 521.2,96.0 522.1,96.0 523.1,96.0 524.0,96.0 524.9,96.0 525.9,96.0 526.8,96.0 527.7,96.0 528.7,96.0 529.6,96.0 530.5,96.0 531.5,96.0 532.4,96.0 533.3,96.0 534.3,96.0 535.2,96.0 536.1,96.0 537.1,96.0 538.0,96.0 538.9,96.0 539.9,96.0 540.8,96.0 541.7,96.0 542.7,96.0 543.6,96.0 544.5,96.0 545.5,96.0 546.4,96.0 547.3,96.0 548.3,96.0 549.2,96.0 550.1,96.0 551.1,96.0 552.0,96.0 552.9,96.0 553.9,96.0 554.8,96.0 555.7,96.0 556.7,96.0 557.6,96.0 558.5,96.0 559.5,96.0 560.4,96.0 561.3,96.0 562.3,96.0 563.2,96.0 564.1,96.0 565.1,96.0 566.0,96.0 566.9,96.0 567.9,96.0 568.8,96.0 569.7,96.0 570.7,96.0 571.6,96.0 572.5,96.0 573.5,96.0 574.4,96.0 575.3,96.0 576.3,96.0 577.2,96.0 578.1,96.0 579.1,96.0\" class=\"sig\"/><line x1=\"20\" y1=\"215\" x2=\"580\" y2=\"215\" class=\"zero\"/><text x=\"20\" y=\"160\" class=\"fig-label\">Laplacian</text><polyline points=\"20.0,215.0 20.9,215.0 21.9,215.0 22.8,215.0 23.7,215.0 24.7,215.0 25.6,215.0 26.5,215.0 27.5,215.0 28.4,215.0 29.3,215.0 30.3,215.0 31.2,215.0 32.1,215.0 33.1,215.0 34.0,215.0 34.9,215.0 35.9,215.0 36.8,215.0 37.7,215.0 38.7,215.0 39.6,215.0 40.5,215.0 41.5,215.0 42.4,215.0 43.3,215.0 44.3,215.0 45.2,215.0 46.1,215.0 47.1,215.0 48.0,215.0 48.9,215.0 49.9,215.0 50.8,215.0 51.7,215.0 52.7,215.0 53.6,215.0 54.5,215.0 55.5,215.0 56.4,215.0 57.3,215.0 58.3,215.0 59.2,215.0 60.1,215.0 61.1,215.0 62.0,215.0 62.9,215.0 63.9,215.0 64.8,215.0 65.7,215.0 66.7,215.0 67.6,215.0 68.5,215.0 69.5,215.0 70.4,215.0 71.3,215.0 72.3,215.0 73.2,215.0 74.1,215.0 75.1,215.0 76.0,215.0 76.9,215.0 77.9,214.9 78.8,214.9 79.7,214.8 80.7,214.7 81.6,214.5 82.5,214.3 83.5,214.1 84.4,213.7 85.3,213.3 86.3,212.8 87.2,212.2 88.1,211.5 89.1,210.8 90.0,210.1 90.9,209.5 91.9,208.9 92.8,208.5 93.7,208.2 94.7,208.1 95.6,208.2 96.5,208.5 97.5,208.9 98.4,209.5 99.3,210.1 100.3,210.8 101.2,211.5 102.1,212.2 103.1,212.8 104.0,213.3 104.9,213.7 105.9,214.1 106.8,214.3 107.7,214.5 108.7,214.7 109.6,214.8 110.5,214.9 111.5,214.9 112.4,215.0 113.3,215.0 114.3,215.0 115.2,215.0 116.1,215.0 117.1,215.0 118.0,215.0 118.9,215.0 119.9,215.0 120.8,215.0 121.7,215.0 122.7,215.0 123.6,215.0 124.5,215.0 125.5,215.0 126.4,215.0 127.3,215.0 128.3,215.0 129.2,215.0 130.1,215.0 131.1,215.0 132.0,215.0 132.9,215.0 133.9,215.0 134.8,215.0 135.7,215.0 136.7,215.0 137.6,215.0 138.5,215.0 139.5,215.0 140.4,215.0 141.3,215.0 142.3,215.0 143.2,215.0 144.1,215.0 145.1,215.0 146.0,215.0 146.9,215.0 147.9,215.0 148.8,215.0 149.7,215.0 150.7,215.0 151.6,215.0 152.5,215.0 153.5,215.0 154.4,215.0 155.3,215.0 156.3,215.0 157.2,215.0 158.1,215.0 159.1,215.0 160.0,215.0 160.9,215.0 161.9,215.0 162.8,215.0 163.7,215.0 164.7,215.0 165.6,215.0 166.5,215.0 167.5,215.0 168.4,215.0 169.3,215.0 170.3,215.0 171.2,215.1 172.1,215.1 173.1,215.2 174.0,215.3 174.9,215.5 175.9,215.7 176.8,215.9 177.7,216.3 178.7,216.7 179.6,217.2 180.5,217.8 181.5,218.5 182.4,219.2 183.3,219.9 184.3,220.5 185.2,221.1 186.1,221.5 187.1,221.8 188.0,221.9 188.9,221.8 189.9,221.5 190.8,221.1 191.7,220.5 192.7,219.9 193.6,219.2 194.5,218.5 195.5,217.8 196.4,217.2 197.3,216.7 198.3,216.3 199.2,215.9 200.1,215.7 201.1,215.5 202.0,215.3 202.9,215.2 203.9,215.1 204.8,215.1 205.7,215.0 206.7,215.0 207.6,215.0 208.5,215.0 209.5,215.0 210.4,215.0 211.3,215.0 212.3,215.0 213.2,215.0 214.1,215.0 215.1,215.0 216.0,215.0 216.9,215.0 217.9,215.0 218.8,215.0 219.7,215.0 220.7,215.0 221.6,215.0 222.5,215.0 223.5,215.0 224.4,215.0 225.3,215.0 226.3,215.0 227.2,215.0 228.1,215.0 229.1,215.0 230.0,215.0 230.9,215.0 231.9,215.0 232.8,215.0 233.7,215.0 234.7,215.0 235.6,215.0 236.5,215.0 237.5,215.0 238.4,215.0 239.3,215.0 240.3,215.0 241.2,215.0 242.1,215.0 243.1,215.0 244.0,215.0 244.9,215.0 245.9,214.9 246.8,214.9 247.7,214.9 248.7,214.8 249.6,214.8 250.5,214.7 251.5,214.7 252.4,214.6 253.3,214.5 254.3,214.3 255.2,214.1 256.1,213.9 257.1,213.7 258.0,213.4 258.9,213.0 259.9,212.6 260.8,212.1 261.7,211.5 262.7,210.9 263.6,210.1 264.5,209.3 265.5,208.4 266.4,207.4 267.3,206.3 268.3,205.2 269.2,204.0 270.1,202.7 271.1,201.5 272.0,200.2 272.9,199.0 273.9,197.9 274.8,196.9 275.7,196.0 276.7,195.4 277.6,195.0 278.5,194.9 279.5,195.2 280.4,195.8 281.3,196.9 282.3,198.4 283.2,200.3 284.1,202.8 285.1,205.7 286.0,209.0 286.9,212.7 287.9,216.7 288.8,221.0 289.7,225.5 290.7,230.2 291.6,234.8 292.5,239.3 293.5,243.6 294.4,247.6 295.3,251.2 296.3,254.2 297.2,256.7 298.1,258.5 299.1,259.6 300.0,260.0 300.9,259.6 301.9,258.5 302.8,256.7 303.7,254.2 304.7,251.2 305.6,247.6 306.5,243.6 307.5,239.3 308.4,234.8 309.3,230.2 310.3,225.5 311.2,221.0 312.1,216.7 313.1,212.7 314.0,209.0 314.9,205.7 315.9,202.8 316.8,200.3 317.7,198.4 318.7,196.9 319.6,195.8 320.5,195.2 321.5,194.9 322.4,195.0 323.3,195.4 324.3,196.0 325.2,196.9 326.1,197.9 327.1,199.0 328.0,200.2 328.9,201.5 329.9,202.7 330.8,204.0 331.7,205.2 332.7,206.3 333.6,207.4 334.5,208.4 335.5,209.3 336.4,210.1 337.3,210.9 338.3,211.5 339.2,212.1 340.1,212.6 341.1,213.0 342.0,213.4 342.9,213.7 343.9,213.9 344.8,214.1 345.7,214.3 346.7,214.5 347.6,214.6 348.5,214.7 349.5,214.7 350.4,214.8 351.3,214.8 352.3,214.9 353.2,214.9 354.1,214.9 355.1,215.0 356.0,215.0 356.9,215.0 357.9,215.0 358.8,215.0 359.7,215.0 360.7,215.0 361.6,215.0 362.5,215.0 363.5,215.0 364.4,215.0 365.3,215.0 366.3,215.0 367.2,215.0 368.1,215.0 369.1,215.0 370.0,215.0 370.9,215.0 371.9,215.0 372.8,215.0 373.7,215.0 374.7,215.0 375.6,215.0 376.5,215.0 377.5,215.0 378.4,215.0 379.3,215.0 380.3,215.0 381.2,215.0 382.1,215.0 383.1,215.0 384.0,215.0 384.9,215.0 385.9,215.0 386.8,215.0 387.7,215.0 388.7,215.0 389.6,215.0 390.5,215.0 391.5,215.0 392.4,215.0 393.3,215.0 394.3,215.0 395.2,215.0 396.1,215.0 397.1,215.0 398.0,215.0 398.9,215.0 399.9,215.0 400.8,215.0 401.7,215.0 402.7,215.0 403.6,215.0 404.5,215.0 405.5,215.0 406.4,215.0 407.3,215.0 408.3,215.0 409.2,215.0 410.1,215.0 411.1,215.0 412.0,215.0 412.9,215.0 413.9,215.0 414.8,215.0 415.7,215.0 416.7,215.0 417.6,215.0 418.5,215.0 419.5,215.0 420.4,215.0 421.3,215.0 422.3,215.0 423.2,215.0 424.1,215.0 425.1,215.0 426.0,215.1 426.9,215.1 427.9,215.1 428.8,215.2 429.7,215.2 430.7,215.3 431.6,215.5 432.5,215.6 433.5,215.9 434.4,216.2 435.3,216.6 436.3,217.2 437.2,218.0 438.1,219.0 439.1,220.3 440.0,221.8 440.9,223.7 441.9,226.0 442.8,228.6 443.7,231.6 444.7,234.9 445.6,238.5 446.5,242.1 447.5,245.7 448.4,249.1 449.3,251.9 450.3,254.0 451.2,255.0 452.1,254.8 453.1,253.1 454.0,249.9 454.9,245.2 455.9,239.1 456.8,231.8 457.7,223.6 458.7,215.0 459.6,206.4 460.5,198.2 461.5,190.9 462.4,184.8 463.3,180.1 464.3,176.9 465.2,175.2 466.1,175.0 467.1,176.0 468.0,178.1 468.9,180.9 469.9,184.3 470.8,187.9 471.7,191.5 472.7,195.1 473.6,198.4 474.5,201.4 475.5,204.0 476.4,206.3 477.3,208.2 478.3,209.7 479.2,211.0 480.1,212.0 481.1,212.8 482.0,213.4 482.9,213.8 483.9,214.1 484.8,214.4 485.7,214.5 486.7,214.7 487.6,214.8 488.5,214.8 489.5,214.9 490.4,214.9 491.3,214.9 492.3,215.0 493.2,215.0 494.1,215.0 495.1,215.0 496.0,215.0 496.9,215.0 497.9,215.0 498.8,215.0 499.7,215.0 500.7,215.0 501.6,215.0 502.5,215.0 503.5,215.0 504.4,215.0 505.3,215.0 506.3,215.0 507.2,215.0 508.1,215.0 509.1,215.0 510.0,215.0 510.9,215.0 511.9,215.0 512.8,215.0 513.7,215.0 514.7,215.0 515.6,215.0 516.5,215.0 517.5,215.0 518.4,215.0 519.3,215.0 520.3,215.0 521.2,215.0 522.1,215.0 523.1,215.0 524.0,215.0 524.9,215.0 525.9,215.0 526.8,215.0 527.7,215.0 528.7,215.0 529.6,215.0 530.5,215.0 531.5,215.0 532.4,215.0 533.3,215.0 534.3,215.0 535.2,215.0 536.1,215.0 537.1,215.0 538.0,215.0 538.9,215.0 539.9,215.0 540.8,215.0 541.7,215.0 542.7,215.0 543.6,215.0 544.5,215.0 545.5,215.0 546.4,215.0 547.3,215.0 548.3,215.0 549.2,215.0 550.1,215.0 551.1,215.0 552.0,215.0 552.9,215.0 553.9,215.0 554.8,215.0 555.7,215.0 556.7,215.0 557.6,215.0 558.5,215.0 559.5,215.0 560.4,215.0 561.3,215.0 562.3,215.0 563.2,215.0 564.1,215.0 565.1,215.0 566.0,215.0 566.9,215.0 567.9,215.0 568.8,215.0 569.7,215.0 570.7,215.0 571.6,215.0 572.5,215.0 573.5,215.0 574.4,215.0 575.3,215.0 576.3,215.0 577.2,215.0 578.1,215.0 579.1,215.0\" class=\"lap\"/><text x=\"20\" y=\"283\" class=\"fig-label\">flat: 0</text><text x=\"141\" y=\"283\" class=\"fig-label mid\">ramp: 0 inside</text><text x=\"300\" y=\"283\" class=\"fig-label mid accent\">bright spot: deep dip</text><text x=\"459\" y=\"283\" class=\"fig-label mid\">edge: + / − pair</text></svg>",
                "caption": "Computed on a real profile: the Laplacian ignores the flat part and the inside of the ramp, plunges at the bright spot, and swings + / − across the edge."
              },
              {
                "kind": "p",
                "text": "<strong>Now two dimensions.</strong> An image has two directions to curve in, so add the curvature along $x$ and along $y$:"
              },
              {
                "kind": "eq",
                "tex": "\\nabla^2 f = \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2} \\quad\\approx\\quad \\begin{bmatrix} 0 & 1 & 0 \\\\ 1 & -4 & 1 \\\\ 0 & 1 & 0 \\end{bmatrix} * f",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "Read the kernel: add the four neighbours, subtract four times the centre. Again, <em>neighbours' average minus me</em>, times four. Same meaning, now in every direction at once."
              },
              {
                "kind": "p",
                "text": "Adding the two curvatures has a lovely consequence: the Laplacian is <strong>rotation invariant</strong>. Turn the image and $f_{xx}$ and $f_{yy}$ change individually, but their sum doesn't (it's the trace of the Hessian, and the trace doesn't care about rotation). The Laplacian doesn't know or care about direction. It only asks: <em>am I a peak, a pit, or neither?</em>"
              },
              {
                "kind": "p",
                "text": "<strong>The problem: noise.</strong> Differences amplify noise, and second differences amplify it twice. On a raw photo, every grain of sensor noise is a tiny spot that differs from its neighbours, and the Laplacian lights up all over. So you blur first, then take the Laplacian. And because both are linear, you can merge them into a single filter:"
              },
              {
                "kind": "eq",
                "tex": "\\nabla^2 (G_\\sigma * I) = (\\nabla^2 G_\\sigma) * I",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "$\\nabla^2 G_\\sigma$ is the <strong>Laplacian of Gaussian</strong> (LoG). Work it out and you get"
              },
              {
                "kind": "eq",
                "tex": "\\nabla^2 G_\\sigma(x, y) = \\frac{x^2 + y^2 - 2\\sigma^2}{\\sigma^4}\\; G_\\sigma(x, y)",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "Look at its shape. At the centre ($x = y = 0$) it's negative. At radius $\\sqrt{2}\\,\\sigma$ it crosses zero. Beyond that it's positive and fades out. It's an upside-down <strong>Mexican hat</strong>: a dip in the middle surrounded by a ring. As a filter it asks, at every point: <em>is the middle brighter than the ring around it?</em>"
              },
              {
                "kind": "p",
                "text": "<strong>Why that finds blobs, and their size.</strong> Convolution is template matching: the response is biggest where the image looks like the filter. A bright disc that fits the dip exactly gives the strongest (most negative) response. Too small a disc only fills part of the dip; too large a disc spills into the ring and cancels itself. So for each blob there's one $\\sigma$ that fits best, and in 2D it's $\\sigma = r / \\sqrt{2}$ for a disc of radius $r$. Sweep $\\sigma$, find the best response, and you've measured the blob's size. That's exactly what step 2's search across scales does."
              },
              {
                "kind": "p",
                "text": "<strong>Why multiply by $\\sigma^2$?</strong> Each derivative of a blurred image scales like $1/\\sigma$, since blurring stretches everything out and flattens slopes. Two derivatives: $1/\\sigma^2$. Without a correction, big blobs at coarse scales would always lose to small ones. Multiplying by $\\sigma^2$ cancels that, so a disc of radius 4 and a disc of radius 40 give the same peak response at their own best $\\sigma$. That's the <strong>scale-normalised</strong> Laplacian, $\\sigma^2 \\nabla^2 G$."
              },
              {
                "kind": "p",
                "text": "<strong>And where DoG comes in.</strong> Blurring is diffusion: brightness flows from bright pixels to dark ones like heat. The heat equation says the rate of change at a point is its Laplacian: a point brighter than its neighbours (negative Laplacian) cools down, a darker one warms up. In scale-space form, $\\partial G / \\partial \\sigma = \\sigma \\nabla^2 G$. So two snapshots of the diffusion, slightly apart in $\\sigma$, differ by roughly the Laplacian:"
              },
              {
                "kind": "eq",
                "tex": "G_{k\\sigma} - G_\\sigma \\approx (k - 1)\\,\\sigma \\cdot \\sigma \\nabla^2 G = (k - 1)\\,\\sigma^2 \\nabla^2 G",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "That's the whole reason SIFT can use a subtraction instead of computing second derivatives: <strong>DoG is the scale-normalised LoG, for free</strong>, and the constant $(k - 1)$ is the same at every scale so it doesn't move any peaks."
              },
              {
                "kind": "p",
                "text": "<strong>Your eyes do this too.</strong> Retinal ganglion cells have centre-surround receptive fields: excited by light in a small centre, inhibited by light in the ring around it (or the reverse). Their response is modelled almost exactly by a difference of Gaussians. Marr and Hildreth (1980) built an edge detector on this idea, using the zero crossings of the LoG as edges. SIFT uses the same filter for the opposite job: not the zero crossings, but the strongest peaks and pits, which are blobs."
              },
              {
                "kind": "p",
                "text": "<strong>And physics.</strong> The Laplacian is everywhere because “how different am I from my surroundings” is what drives so much of nature: heat flows down it, a stretched soap film settles where it's zero everywhere (every point is the average of its neighbours), and gravitational and electric potentials are governed by it. In an image, it is the simplest possible question you can ask about a point, and it turns out to be the right one for finding things worth matching."
              }
            ]
          },
          {
            "kind": "ai",
            "lines": [
              "Blurring removes detail smaller than the blur, so a stack of blurs is like stepping further and further back from the scene",
              "<strong>Levels</strong>: each blur is $k$ times the last. With $s$ levels per octave, $k = 2^{1/s}$, so the blur doubles across an octave",
              "<strong>Octaves</strong>: once the blur has doubled, halve the image and start again. Same information, a quarter of the pixels",
              "Lowe's settings: $\\sigma = 1.6$, $s = 3$, input image doubled first (almost 4× more stable keypoints). Each octave needs $s + 3 = 6$ blurred images",
              "Subtract neighbouring blurs to get the <strong>Difference of Gaussians</strong>, the space keypoints are found in:"
            ]
          },
          {
            "kind": "eq",
            "tex": "D(x, y, \\sigma) = L(x, y, k\\sigma) - L(x, y, \\sigma) \\;\\approx\\; (k-1)\\,\\sigma^2 \\nabla^2 G * I",
            "source": "ai"
          },
          {
            "kind": "ai",
            "lines": [
              "The approximation comes from the heat equation, $\\partial G/\\partial\\sigma = \\sigma\\nabla^2 G$. $\\sigma^2\\nabla^2 G$ is the <strong>scale-normalised Laplacian</strong>, which responds most to a blob of its own size",
              "So DoG is a band-pass filter. A feature peaks at the blur that matches its size, which tells you <em>how big</em> it is as well as <em>where</em>"
            ]
          }
        ]
      },
      {
        "n": 2,
        "act": "Scale",
        "title": "Comparing each space with the one above and below",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Compare each point with its neighbours, including the spaces above (↑) and below (↓)",
              "$(3 \\times 3 \\times 3) - 1 = 26$"
            ]
          },
          {
            "kind": "explain",
            "paras": [
              "Step 1 gave a 3D volume $D(x, y, \\sigma)$. A keypoint is a local extremum of that volume in all three directions at once. A peak in space alone isn't enough: a blob gives a spatial peak at many blur levels, strongest at its natural size and fading either side. Asking for a peak across $\\sigma$ as well picks exactly one level, the <strong>characteristic scale</strong>. So every keypoint comes out as $(x, y, \\sigma)$: where it is and how big it is.",
              "<strong>Maxima and minima mean different things.</strong> At the centre of a bright blob, more blur pulls the centre down, so $D = L(k\\sigma) - L(\\sigma)$ is negative: bright blobs are minima. Dark blobs are maxima. SIFT keeps both.",
              "<strong>Why only the immediate neighbours?</strong> $3 \\times 3 \\times 3$ is the smallest neighbourhood that can define an extremum. Lowe tested how many levels per octave to sample: 3 gave the most repeatable keypoints. More levels found more keypoints, but the extra ones were less stable."
            ]
          },
          {
            "kind": "figure",
            "svg": "<svg viewBox=\"0 0 640 230\" role=\"img\" aria-label=\"A stack of three DoG layers; a point in the middle layer is compared with 8 neighbours in its own layer and 9 in each layer above and below\">\n    <g class=\"fig-grid\">\n      <g transform=\"translate(60,20)\">\n        <path d=\"M0 40 L120 0 L240 40 L120 80 Z\" class=\"layer\"/>\n        <text x=\"250\" y=\"45\" class=\"fig-label\">σ·k² (above)</text>\n      </g>\n      <g transform=\"translate(60,80)\">\n        <path d=\"M0 40 L120 0 L240 40 L120 80 Z\" class=\"layer\"/>\n        <text x=\"250\" y=\"45\" class=\"fig-label\">σ·k (same level)</text>\n      </g>\n      <g transform=\"translate(60,140)\">\n        <path d=\"M0 40 L120 0 L240 40 L120 80 Z\" class=\"layer\"/>\n        <text x=\"250\" y=\"45\" class=\"fig-label\">σ (below)</text>\n      </g>\n      <g class=\"nbr\">\n        <path d=\"M150 50 L180 40 L210 50 L180 60 Z\"/>\n        <path d=\"M150 110 L180 100 L210 110 L180 120 Z\"/>\n        <path d=\"M150 170 L180 160 L210 170 L180 180 Z\"/>\n      </g>\n      <circle cx=\"180\" cy=\"110\" r=\"5\" class=\"centre\"/>\n      <line x1=\"180\" y1=\"50\" x2=\"180\" y2=\"170\" class=\"axis\"/>\n    </g>\n    <text x=\"440\" y=\"90\" class=\"fig-big\">3 × 3 × 3 − 1</text>\n    <text x=\"440\" y=\"122\" class=\"fig-big accent\">= 26 neighbours</text>\n    <text x=\"440\" y=\"152\" class=\"fig-label\">9 above · 8 around · 9 below</text>\n  </svg>",
            "caption": "A candidate must beat every neighbour in space <em>and</em> in scale."
          },
          {
            "kind": "ai",
            "lines": [
              "8 around the point in its own layer, 9 in the layer above, 9 in the layer below",
              "A candidate must be larger than all 26 or smaller than all 26. A peak in space means it stands out; a peak in scale means this is the size at which it stands out most",
              "Most pixels fail in the first few comparisons. Still thousands of candidates per image, many bad. Steps 3 and 4 clean them up"
            ]
          }
        ]
      },
      {
        "n": 3,
        "act": "Scale",
        "title": "Finding the keypoint: the maximum among the 26",
        "subtitle": "Hessian matrix and Taylor expansion",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Maximum point among the 26 → Hessian matrix, Taylor expansion → keypoint localisation"
            ]
          },
          {
            "kind": "eq",
            "tex": "D(\\mathbf{x}) \\approx D + \\nabla D^{\\top}\\mathbf{x} + \\tfrac{1}{2}\\,\\mathbf{x}^{\\top} H\\,\\mathbf{x}"
          },
          {
            "kind": "explain",
            "paras": [
              "The grid is coarse. In octave $o$ one sample stands for $2^o$ original pixels, and neighbouring levels are $k = 2^{1/3} \\approx 1.26$ apart in $\\sigma$. The real extremum of the continuous $D$ lives somewhere between grid points.",
              "The fix is the same trick as finding the top of a hill from a few height measurements: fit the simplest curved surface through them and read off its top. In one dimension that's a parabola through three points. In $(x, y, \\sigma)$ it's a quadratic surface, which is exactly what a second-order Taylor expansion is. The Hessian here is the curvature that bends that surface; the gradient is its tilt."
            ]
          },
          {
            "kind": "ai",
            "lines": [
              "The maximum from step 2 is only accurate to one pixel and one blur level. The true peak sits <em>between</em> samples",
              "$\\mathbf{x} = (x, y, \\sigma)$ is the offset from the sample, $\\nabla D$ a 3-vector, $H$ the $3 \\times 3$ Hessian over $x$, $y$, $\\sigma$, all from differences of neighbouring samples",
              "Set the derivative to zero to get the peak:"
            ]
          },
          {
            "kind": "eq",
            "tex": "\\hat{\\mathbf{x}} = -H^{-1}\\nabla D",
            "source": "ai"
          },
          {
            "kind": "ai",
            "lines": [
              "If any part of $\\hat{\\mathbf{x}}$ is over 0.5, the peak is nearer another sample: move there and refit (OpenCV gives up after 5 tries)",
              "The value at the peak, $D(\\hat{\\mathbf{x}}) = D + \\tfrac{1}{2}\\nabla D^{\\top}\\hat{\\mathbf{x}}$, is the contrast. Drop the point if $|D(\\hat{\\mathbf{x}})| < 0.03$ (pixel values in $[0, 1]$): noise could move or erase it"
            ]
          },
          {
            "kind": "tangent",
            "title": "Why on earth is a Taylor series useful here?",
            "blocks": [
              {
                "kind": "p",
                "text": "$D$ is a smooth function of $x$, $y$ and $\\sigma$, but we only have it at integer pixels and a few blur levels. The true peak is between the samples, so we <strong>guess the shape</strong> of $D$ near the sample and find the peak of the guess."
              },
              {
                "kind": "p",
                "text": "A Taylor series is exactly that guess: describe a function near a point from its value and derivatives there. First order is a tilted plane, which has no peak. Second order is the simplest shape that has one, a dome or a bowl. That's why it stops at the Hessian."
              },
              {
                "kind": "p",
                "text": "<strong>In 1D</strong>, with three samples $f(-1)$, $f(0)$, $f(1)$:"
              },
              {
                "kind": "eq",
                "tex": "f' \\approx \\frac{f(1) - f(-1)}{2}, \\qquad f'' \\approx f(1) - 2f(0) + f(-1), \\qquad \\hat{x} = -\\frac{f'}{f''}",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "That's a parabola through three points. With $f(-1) = 0.60$, $f(0) = 0.80$, $f(1) = 0.70$: $f' = 0.05$, $f'' = -0.30$, so $\\hat{x} \\approx 0.17$. The peak is a sixth of a pixel towards the bigger neighbour, with value $0.80 + \\tfrac{1}{2}(0.05)(0.17) \\approx 0.804$."
              },
              {
                "kind": "p",
                "text": "<strong>In 3D</strong> the slope becomes a 3-vector and the curvature a $3 \\times 3$ matrix, each entry a difference of neighbours, e.g."
              },
              {
                "kind": "eq",
                "tex": "D_{xy} \\approx \\tfrac{1}{4}\\big[D(x{+}1, y{+}1) - D(x{+}1, y{-}1) - D(x{-}1, y{+}1) + D(x{-}1, y{-}1)\\big]",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "and slope over curvature becomes $-H^{-1}\\nabla D$: one $3 \\times 3$ solve per keypoint."
              },
              {
                "kind": "p",
                "text": "<strong>The 0.5 rule</strong>: a Taylor expansion is only trustworthy near where it was built. An offset over half a sample means another sample is closer, and its expansion is better."
              },
              {
                "kind": "p",
                "text": "<strong>Why bother</strong>: errors scale with the octave. One pixel in the fourth octave is 8 original pixels, so 0.4 px off there is about 3 px in the image, and that goes straight into triangulation."
              }
            ]
          }
        ]
      },
      {
        "n": 4,
        "act": "Scale",
        "title": "Filtering keypoints based on edges and corners",
        "subtitle": "The Hessian again, now 2 × 2",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Hessian of the keypoint:"
            ]
          },
          {
            "kind": "eq",
            "tex": "H = \\begin{bmatrix} D_{xx} & D_{xy} \\\\ D_{xy} & D_{yy} \\end{bmatrix}"
          },
          {
            "kind": "board",
            "lines": [
              "Two eigenvalues: curvature in the horizontal and vertical directions",
              "Corner condition: both eigenvalues will be high",
              "Keep the point if:"
            ]
          },
          {
            "kind": "eq",
            "tex": "\\frac{\\operatorname{Tr}(H)^2}{\\det(H)} < \\frac{(r+1)^2}{r}"
          },
          {
            "kind": "explain",
            "paras": [
              "Picture $D$ near a keypoint as a surface. A blob is a <strong>dome</strong>: it curves down in every direction. An edge is a <strong>ridge</strong>, like a long tent: it curves sharply across and stays flat along it.",
              "Put a marble on top. On a dome it's pinned. On a ridge it can roll along the top. That rolling is the instability: noise, or a slightly different viewpoint, moves the detected point along the edge, and the two photos no longer agree on where it is.",
              "The Hessian is the local shape of that surface. Its eigenvectors are the directions of strongest and weakest curvature; its eigenvalues say how strong. Dome: both large, same sign. Ridge: one large, one near zero. Saddle: opposite signs. The test only needs to tell a dome from a ridge, and the trace and determinant are enough for that."
            ]
          },
          {
            "kind": "figure",
            "svg": "<svg viewBox=\"0 0 640 170\" role=\"img\" aria-label=\"Flat region: both eigenvalues small. Edge: one large, one small. Corner: both large.\">\n    <g transform=\"translate(40,20)\">\n      <rect width=\"140\" height=\"100\" class=\"patch\"/>\n      <text x=\"70\" y=\"128\" class=\"fig-label mid\">flat</text>\n      <text x=\"70\" y=\"148\" class=\"fig-label mid\">α ≈ β ≈ 0</text>\n    </g>\n    <g transform=\"translate(250,20)\">\n      <rect width=\"140\" height=\"100\" class=\"patch\"/>\n      <rect x=\"0\" y=\"0\" width=\"70\" height=\"100\" class=\"dark\"/>\n      <path d=\"M70 10 L70 90\" class=\"arrow-line\"/>\n      <text x=\"70\" y=\"128\" class=\"fig-label mid\">edge</text>\n      <text x=\"70\" y=\"148\" class=\"fig-label mid\">α ≫ β</text>\n    </g>\n    <g transform=\"translate(460,20)\">\n      <rect width=\"140\" height=\"100\" class=\"patch\"/>\n      <rect x=\"0\" y=\"0\" width=\"70\" height=\"50\" class=\"dark\"/>\n      <circle cx=\"70\" cy=\"50\" r=\"6\" class=\"centre\"/>\n      <text x=\"70\" y=\"128\" class=\"fig-label mid accent\">corner: keep</text>\n      <text x=\"70\" y=\"148\" class=\"fig-label mid\">α and β both large</text>\n    </g>\n  </svg>",
            "caption": "Keep a point only where the curvature is high in both directions."
          },
          {
            "kind": "ai",
            "lines": [
              "Why drop edges: DoG fires along edges too, but a point on an edge can slide along it and look the same, so it can't be matched reliably",
              "Where the formula comes from: $\\operatorname{Tr}(H) = \\alpha + \\beta$, $\\det(H) = \\alpha\\beta$. Write $\\alpha = r\\beta$:"
            ]
          },
          {
            "kind": "eq",
            "tex": "\\frac{(\\alpha+\\beta)^2}{\\alpha\\beta} = \\frac{(r\\beta + \\beta)^2}{r\\beta^2} = \\frac{(r+1)^2}{r}",
            "source": "ai"
          },
          {
            "kind": "ai",
            "lines": [
              "$\\beta$ cancels, so the test depends only on how lopsided the curvature is: smallest at $r = 1$, growing as the point gets more edge-like. No eigenvalues computed",
              "Lowe uses $r = 10$, a threshold of $12.1$. If $\\det(H) < 0$ the curvatures have opposite signs, a saddle, so drop it too"
            ]
          },
          {
            "kind": "tangent",
            "title": "Wait, there are two Hessians. What's the difference?",
            "blocks": [
              {
                "kind": "p",
                "text": "A Hessian is the matrix of second derivatives: it measures <strong>curvature</strong>. SIFT uses it twice, for two different questions."
              },
              {
                "kind": "html",
                "html": "<div class=\"r-pair\"><div class=\"r-card\"><p class=\"r-card-t\">Localisation · 3 × 3</p><div>$$\\begin{bmatrix} D_{xx} & D_{xy} & D_{x\\sigma} \\\\ D_{xy} & D_{yy} & D_{y\\sigma} \\\\ D_{x\\sigma} & D_{y\\sigma} & D_{\\sigma\\sigma} \\end{bmatrix}$$</div><p>Over $x$, $y$ <em>and</em> $\\sigma$. Asks <strong>where exactly is the top of the hill</strong>, in space and scale. Inverted to solve for the offset.</p></div><div class=\"r-card\"><p class=\"r-card-t\">Edge test · 2 × 2</p><div>$$\\begin{bmatrix} D_{xx} & D_{xy} \\\\ D_{xy} & D_{yy} \\end{bmatrix}$$</div><p>Over $x$, $y$ only. Asks <strong>is it a hill or a ridge</strong>. Only its trace and determinant are used.</p></div></div>"
              },
              {
                "kind": "p",
                "text": "The 2 × 2 is the top-left corner of the 3 × 3, so nothing new is computed. Scale is left out because \"edge\" is about shape in the image plane: how the response changes with blur says nothing about line versus point."
              },
              {
                "kind": "p",
                "text": "<strong>Hill or ridge, in numbers</strong>, with $r = 10$ so the cut-off is $12.1$:"
              },
              {
                "kind": "table",
                "headers": [
                  "",
                  "$D_{xx}$",
                  "$D_{yy}$",
                  "$D_{xy}$",
                  "$\\operatorname{Tr}^2/\\det$",
                  ""
                ],
                "rows": [
                  [
                    "ridge",
                    "−0.40",
                    "−0.02",
                    "0",
                    "22.1",
                    "drop"
                  ],
                  [
                    "peak",
                    "−0.30",
                    "−0.25",
                    "0.02",
                    "4.1",
                    "keep"
                  ]
                ],
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "<strong>Why trace and determinant</strong>: they don't change when the image rotates, because they are the sum and product of the eigenvalues. So the test asks how lopsided the curvature is without finding which way the edge runs."
              },
              {
                "kind": "p",
                "text": "The Harris corner detector asks the same question one derivative lower, using the structure tensor built from first derivatives."
              }
            ]
          }
        ]
      },
      {
        "n": 5,
        "act": "Rotation",
        "title": "Handling rotational invariance",
        "subtitle": "Image gradients and a direction histogram",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Calculate the image gradient:"
            ]
          },
          {
            "kind": "eq",
            "tex": "m(x, y) = \\sqrt{L_x^2 + L_y^2} \\qquad \\theta(x, y) = \\operatorname{atan2}(L_y, L_x)"
          },
          {
            "kind": "explain",
            "paras": [
              "There are two ways to be rotation invariant. One is to design a description that looks the same at every rotation, which throws information away. SIFT does the other: it measures the patch's own dominant direction and describes everything <em>relative to it</em>.",
              "It's how you'd describe a face: “the nose is below the eyes”, not “the nose is at the bottom of the photo”. Turn the photo and the first description still holds. The orientation is the patch’s own “up”.",
              "Votes are weighted by magnitude so strong edges dominate, and by a Gaussian so the edge of the window, the part most likely to change between photos, counts least."
            ]
          },
          {
            "kind": "question",
            "text": "Why do this again at the image level??"
          },
          {
            "kind": "tangent",
            "title": "Why gradients again, at the image level?",
            "blocks": [
              {
                "kind": "p",
                "text": "Short answer: at the keypoint, the DoG has nothing left to say about direction. Long answer, in three parts."
              },
              {
                "kind": "p",
                "text": "<strong>1. The keypoint is an extremum of $D$, so $\\nabla D = 0$ there.</strong> We chose it precisely because $D$ is flat at the top. Around it $D$ is a dome, so its gradients point straight in or straight out, the same all the way round. A dome has no preferred direction, and a histogram of its gradients is close to uniform. Using $D$ for orientation is like asking a ball which way it is facing."
              },
              {
                "kind": "p",
                "text": "<strong>2. DoG is a second-derivative operator.</strong> It approximates the Laplacian, which is rotationally symmetric: it measures how a point differs from its surroundings, not which way the surroundings change. An edge in the image becomes two lobes in $D$, positive on one side and negative on the other, crossing zero on the edge. Gradients of $D$ point in opposite directions on either side, so votes split 180° apart."
              },
              {
                "kind": "p",
                "text": "<strong>3. DoG throws away low frequencies.</strong> It's band-pass. The broad shading that says <em>this patch gets brighter towards the top right</em> is exactly what it subtracted out. Orientation needs that."
              },
              {
                "kind": "p",
                "text": "$L$, the blurred image, keeps all of it. Its first derivatives point across real edges, from dark to light, with a magnitude that says how sharp the edge is. That is what you want to vote with. So the two images play two roles: <strong>$D$ is the detector</strong> (where and how big), <strong>$L$ is the describer</strong> (what it looks like)."
              },
              {
                "kind": "p",
                "text": "<strong>Why $L$ at the keypoint's own scale, not the original image?</strong> Scale invariance has to carry through. A keypoint found at $\\sigma = 4$ is a structure about four times bigger than one at $\\sigma = 1$. Reading gradients from $L$ at $\\sigma = 4$ shows that patch at the same level of detail as the small one, so two photos taken at different distances produce the same gradient pattern. Raw image gradients would be dominated by fine texture the other photo can't even see."
              },
              {
                "kind": "p",
                "text": "<strong>Why $\\operatorname{atan2}$:</strong> $\\arctan(L_y / L_x)$ can't tell $(1, 1)$ from $(-1, -1)$; both give 45°. $\\operatorname{atan2}$ looks at both signs, so a dark-to-light edge (45°) is told apart from light-to-dark (225°). Without it, every orientation would be ambiguous by half a turn."
              }
            ]
          },
          {
            "kind": "board",
            "lines": [
              "Calculate the rotational gradient: a histogram of direction against magnitude"
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Direction",
              "Magnitude"
            ],
            "rows": [
              [
                "90°",
                "16"
              ],
              [
                "180°",
                "23"
              ],
              [
                "270°",
                "25"
              ],
              [
                "…",
                "…"
              ]
            ]
          },
          {
            "kind": "ai",
            "lines": [
              "Lowe's histogram has <strong>36 bins of 10°</strong>. Each pixel votes with its magnitude, weighted by a Gaussian of $1.5\\times$ the keypoint's scale",
              "The tallest bin is the orientation, refined with a parabola through it and its two neighbours",
              "Any other peak within <strong>80%</strong> of the tallest creates a second keypoint at the same spot. Here $23/25 = 0.92$, so 180° gets its own. About 15% of keypoints get more than one, and they noticeably help matching"
            ]
          }
        ]
      },
      {
        "n": 6,
        "act": "Describe",
        "title": "Computing the descriptor",
        "subtitle": "128 numbers per keypoint",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "For each keypoint, choose 4 × 4 → 16 surrounding regions",
              "16 × 16 pixel window → 4 × 4 regions, each with its gradients",
              "Divide 360° into 8 bins, which gives 8 values per region"
            ]
          },
          {
            "kind": "eq",
            "tex": "8 \\text{ bins per region} \\times 16 \\text{ regions} = 128"
          },
          {
            "kind": "explain",
            "paras": [
              "<strong>Why not just store the 16 × 16 pixels?</strong> Raw pixels are brittle. Shift the window by one pixel, or change the viewpoint slightly, and every value changes. A histogram is forgiving: a gradient that moves a pixel or two inside its 4 × 4 region still lands in the same region and the same bin.",
              "So the descriptor keeps position only roughly (which of 16 regions) and direction only roughly (which of 8 bins). Precise enough to be distinctive, coarse enough to survive a change of viewpoint. That balance is the whole design.",
              "The idea comes from biology. Lowe cites a model of <strong>complex cells</strong> in the visual cortex (Edelman, Intrator and Poggio, 1997): neurons that respond to an edge of a particular orientation but don't mind if it moves a little within their receptive field. Matching with that kind of tolerance recognised 3D objects better than matching exact positions.",
              "<strong>Why 4 × 4 × 8?</strong> Lowe tried grid sizes and bin counts. A 2 × 2 grid wasn't distinctive enough; bigger grids got too sensitive to distortion. 4 × 4 regions with 8 bins matched best, and that is where 128 comes from."
            ]
          },
          {
            "kind": "figure",
            "svg": "<svg viewBox=\"0 0 640 250\" role=\"img\" aria-label=\"A 16 by 16 pixel window split into a 4 by 4 grid of regions; each region becomes an 8-bin histogram of gradient directions; 16 regions times 8 bins gives 128 numbers\">\n    <g transform=\"translate(30,30)\">\n      <rect width=\"160\" height=\"160\" class=\"patch\"/>\n      <g class=\"fine\">\n        <path d=\"M10 0V160M20 0V160M30 0V160M50 0V160M60 0V160M70 0V160M90 0V160M100 0V160M110 0V160M130 0V160M140 0V160M150 0V160\"/>\n        <path d=\"M0 10H160M0 20H160M0 30H160M0 50H160M0 60H160M0 70H160M0 90H160M0 100H160M0 110H160M0 130H160M0 140H160M0 150H160\"/>\n      </g>\n      <g class=\"coarse\"><path d=\"M40 0V160M80 0V160M120 0V160M0 40H160M0 80H160M0 120H160\"/></g>\n      <circle cx=\"80\" cy=\"80\" r=\"5\" class=\"centre\"/>\n      <text x=\"80\" y=\"185\" class=\"fig-label mid\">16 × 16 pixels</text>\n      <text x=\"80\" y=\"203\" class=\"fig-label mid\">split into 4 × 4 regions</text>\n    </g>\n    <text x=\"215\" y=\"115\" class=\"fig-big\">→</text>\n    <g transform=\"translate(250,30)\">\n      <rect width=\"160\" height=\"160\" class=\"patch\"/>\n      <g class=\"coarse\"><path d=\"M40 0V160M80 0V160M120 0V160M0 40H160M0 80H160M0 120H160\"/></g>\n      <g class=\"vanes\">\n        <path d=\"M20 20l12 -8M60 20l-10 10M100 20l0 -13M140 20l11 6M20 60l-9 -9M60 60l13 0M100 60l-6 12M140 60l8 -10M20 100l0 13M60 100l10 8M100 100l-12 -4M140 100l5 -12M20 140l12 4M60 140l-8 -10M100 140l10 -9M140 140l-12 6\"/>\n      </g>\n      <text x=\"80\" y=\"185\" class=\"fig-label mid\">each region: 8 directions</text>\n      <text x=\"80\" y=\"203\" class=\"fig-label mid\">(one weather vane per cell)</text>\n    </g>\n    <text x=\"432\" y=\"115\" class=\"fig-big\">→</text>\n    <g transform=\"translate(470,60)\">\n      <text x=\"0\" y=\"40\" class=\"fig-big\">8 × 16</text>\n      <text x=\"0\" y=\"78\" class=\"fig-big accent\">= 128</text>\n      <text x=\"0\" y=\"110\" class=\"fig-label\">bins per region × regions</text>\n    </g>\n  </svg>",
            "caption": "Sixteen little weather vanes, each recording which way the gradients blow and how hard."
          },
          {
            "kind": "ai",
            "lines": [
              "The window is <strong>rotated to the keypoint's orientation</strong> and directions are measured relative to it. This is where rotation invariance actually happens",
              "Votes are weighted by a Gaussian with σ half the window width, so a small position error matters less",
              "Each vote is shared between neighbouring regions and bins (trilinear interpolation), so a one-pixel shift doesn't flip a value into another bin",
              "Normalise to unit length (cancels contrast; brightness offsets don't touch gradients), clip at <strong>0.2</strong> so glare-driven gradients can't dominate, normalise again"
            ]
          }
        ]
      },
      {
        "n": 7,
        "act": "Match",
        "title": "Matching",
        "subtitle": "Extract descriptors from both images and compare",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Distance between two descriptors:"
            ]
          },
          {
            "kind": "eq",
            "tex": "d(d_A, d_B) = \\sqrt{\\sum_{i=1}^{128} \\left(d_{A,i} - d_{B,i}\\right)^2}"
          },
          {
            "kind": "board",
            "lines": [
              "Low ratio test:"
            ]
          },
          {
            "kind": "eq",
            "tex": "\\frac{d_1}{d_2} < 0.8"
          },
          {
            "kind": "board",
            "lines": [
              "Then RANSAC"
            ]
          },
          {
            "kind": "explain",
            "paras": [
              "Matching is a search in a 128-dimensional space. Every keypoint in image A is a point there; we look for the closest point from image B.",
              "<strong>RANSAC is a vote.</strong> Each random minimal sample proposes a hypothesis for how the two views are related, and every match votes for or against it. Wrong matches are scattered at random, so they never agree on anything. Right matches all agree on the same geometry. The hypothesis with the most votes wins, and it doesn't matter how wild the wrong matches are."
            ]
          },
          {
            "kind": "ai",
            "lines": [
              "Nearest neighbour alone fails: every keypoint has one, even when it isn't in the other image. A fixed distance threshold fails too, since some descriptors are more distinctive than others",
              "$d_1$ is the nearest distance, $d_2$ the second nearest. The test asks for a <em>clear</em> winner; if they're close, the point is ambiguous (repeated windows, texture). Lowe: 0.8 removes about 90% of false matches and loses under 5% of correct ones",
              "<strong>RANSAC</strong>: sample the fewest matches that fix a model, fit, count matches that agree within a few pixels, repeat, keep the model with most inliers, refit on them",
              "The model: a homography (4 matches) for a flat scene or pure rotation, the fundamental matrix $F$ (7 or 8) for a general scene, the essential matrix $E$ (5) with calibrated cameras",
              "Rounds needed, for inlier fraction $w$, sample size $n$, confidence $p$:"
            ]
          },
          {
            "kind": "eq",
            "tex": "N = \\frac{\\log(1-p)}{\\log(1-w^n)}",
            "source": "ai"
          },
          {
            "kind": "ai",
            "lines": [
              "With $w = 0.5$, $p = 0.99$: 72 rounds for a homography, about 1,177 for 8-point $F$. That's why small minimal solvers matter, and where epipolar geometry comes in next"
            ]
          },
          {
            "kind": "tangent",
            "title": "Why a ratio, and not a fixed distance?",
            "blocks": [
              {
                "kind": "p",
                "text": "In 128 dimensions distances behave strangely: random points end up at similar distances from each other (distances <em>concentrate</em>). So the raw distance to the nearest neighbour says little. A correct match on a blurry patch can be further away than a wrong match on a sharp one."
              },
              {
                "kind": "p",
                "text": "The second-nearest neighbour fixes this. If a keypoint has a true match, there is one correct candidate and everything else is wrong. So the second nearest is almost always a wrong match, and its distance estimates <strong>how close impostors get in this part of the space</strong>. The ratio asks: is the best candidate clearly closer than the typical impostor here?"
              },
              {
                "kind": "p",
                "text": "Lowe plotted the ratio for correct and incorrect matches against a database of 40,000 keypoints. Correct matches cluster at low ratios; incorrect ones pile up near 1. A cut at 0.8 is where that gives the 90% / 5% split."
              },
              {
                "kind": "p",
                "text": "It fails where you'd expect: repeated structure. Two identical windows give two near-equal distances, a ratio near 1, and a true match gets thrown out. Losing it is better than being confidently wrong, and RANSAC can't rescue a match that was never kept."
              }
            ]
          }
        ]
      }
    ],
    "questions": [
      "Why $\\sigma = 1.6$ and 3 levels per octave? What does the repeatability curve look like?",
      "Why does doubling the input image give almost four times as many stable keypoints?",
      "Where does the 0.2 clipping value come from?",
      "Why does RootSIFT (Hellinger kernel) match better than plain SIFT?",
      "How do you choose the RANSAC inlier threshold, and what goes wrong fitting $F$ to a nearly flat scene?",
      "How is the 8-point algorithm derived, and why does it need normalised coordinates?",
      "How do affine-invariant variants handle the large viewpoint changes SIFT can't?",
      "What do learned features (SuperPoint, LightGlue) learn that these hand-made steps miss, and where does SIFT still win?"
    ]
  },
  {
    "day": 2,
    "date": "2026-11-08",
    "curiosityTitle": "Epipolar geometry: why a match has to sit on a line",
    "summary": "SIFT hands over pairs of pixels it thinks are the same point, and some of them are wrong. Geometry alone can catch most of them: two cameras and a point make a flat triangle, and that one fact turns into a 3×3 matrix that sends every pixel in one photo to a line in the other.",
    "bullets": [
      "From a flat triangle to the Essential and Fundamental matrices, one step at a time, with numbers checked at every step."
    ],
    "stages": [
      2
    ],
    "intro": [
      {
        "kind": "tangent",
        "title": "Where E and F come from",
        "blocks": [
          {
            "kind": "p",
            "text": "<strong>Photogrammetry first.</strong> Surveyors making maps from aerial photographs had the core idea long before computers: the two camera centres and a ground point must lie in one plane. They called it the <em>coplanarity condition</em> and solved it by hand and with mechanical plotters."
          },
          {
            "kind": "p",
            "text": "<strong>1981, the Essential matrix.</strong> H. C. Longuet-Higgins, a theoretical chemist turned cognitive scientist, published <em>A computer algorithm for reconstructing a scene from two projections</em> in <em>Nature</em>. Two pages. It wrote the coplanarity condition as $x'^\\top E x = 0$ and showed that 8 matched points give $E$ by solving a linear system. That is the eight-point algorithm you'll meet in RANSAC."
          },
          {
            "kind": "p",
            "text": "<strong>Same year, RANSAC.</strong> Fischler and Bolles published <em>Random Sample Consensus</em> in 1981 too, for a different problem (locating a camera from known landmarks). The two ideas met later and became the standard way to match photos."
          },
          {
            "kind": "p",
            "text": "<strong>Early 1990s, the Fundamental matrix.</strong> $E$ needs to know each camera's focal length and centre. Faugeras and, independently, Hartley showed in 1992 that you can skip that and work on raw pixels. Luong and Faugeras named the pixel version the <em>Fundamental matrix</em>. Hartley's 1997 paper <em>In defense of the eight-point algorithm</em> then showed that the simple linear method works well if you first rescale the coordinates, and it has been the default ever since."
          }
        ]
      }
    ],
    "steps": [
      {
        "n": 1,
        "act": "Goal",
        "title": "What problem are we solving?",
        "subtitle": "A yes/no test for a match, using only geometry",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "SIFT gives matched pixels: this spot in photo 1 = that spot in photo 2",
              "Some of those matches are wrong",
              "We want a <strong>test</strong>: is this match possible or impossible, using only geometry"
            ]
          },
          {
            "kind": "explain",
            "paras": [
              "Day 1 ended with matches that had passed the ratio test. That test only asks whether a descriptor looks clearly more like one candidate than any other. It knows nothing about the scene. A white window frame matches the window frame next to it, a patch of leaves matches another patch of leaves, and the ratio test can be fooled by both.",
              "Geometry gives a check that descriptors can't. Both photos were taken of one rigid scene from two places. That puts a hard constraint on where a point from photo 1 is <em>allowed</em> to show up in photo 2. It can't be just anywhere: it has to be on one particular line. A match off that line is impossible, however good its descriptor looks.",
              "Everything below is the derivation of that line. It helps to keep the end in mind: we're building a function that takes a pixel in photo 1 and returns a line in photo 2, and the test is \"is the matched pixel on it?\""
            ]
          }
        ]
      },
      {
        "n": 2,
        "act": "Tools",
        "title": "The linear algebra you need",
        "subtitle": "Four ideas, each with a number",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "A vector is an arrow: $a = (2, 1, 4)$ is 2 along x, 1 along y, 4 along z",
              "<strong>Dot product</strong>: multiply matching parts and add. Dot = 0 means the arrows are at 90°",
              "<strong>Cross product</strong>: gives a third arrow at 90° to both",
              "<strong>Three arrows flat?</strong> Cross two of them, dot with the third. Zero means they lie in one plane"
            ]
          },
          {
            "kind": "eq",
            "tex": "a \\cdot b = a_x b_x + a_y b_y + a_z b_z = a^\\top b"
          },
          {
            "kind": "eq",
            "tex": "a \\times b = \\begin{bmatrix} a_y b_z - a_z b_y \\\\ a_z b_x - a_x b_z \\\\ a_x b_y - a_y b_x \\end{bmatrix}"
          },
          {
            "kind": "eq",
            "tex": "c \\cdot (a \\times b) = 0 \\quad\\Longleftrightarrow\\quad a,\\ b,\\ c \\text{ lie in one plane}"
          },
          {
            "kind": "explain",
            "paras": [
              "<strong>Dot product, with numbers.</strong> The x-axis and the y-axis: $(1,0,0)\\cdot(0,1,0) = 0$. They're perpendicular, and the answer is 0. Less obvious: $(1,2,0)\\cdot(2,-1,5) = 2 - 2 + 0 = 0$. You can't see that those are at right angles by looking at them, but the dot product catches it. In formulas the same thing is written $a^\\top b$: $a$ as a row, $b$ as a column, multiplied.",
              "<strong>Cross product, with numbers.</strong> $(1,0,0)\\times(0,1,0) = (0,0,1)$: x-axis cross y-axis is the z-axis, perpendicular to both. Picture two pencils lying on a table. Their cross product points straight up out of the table. That \"straight up\" arrow is the table's <strong>normal</strong>, and it describes the plane completely: the plane is everything perpendicular to it.",
              "<strong>Putting them together.</strong> Three arrows $a, b, c$. Cross $a$ and $b$ to get the normal $n$ of the table they lie on. If $c$ lies on the same table, it's perpendicular to $n$, so $c \\cdot n = 0$. This is the <strong>scalar triple product</strong>. It's also the volume of the slanted box the three arrows span, and a flat box has zero volume.",
              "That's the whole toolkit. Every step below uses only these."
            ]
          },
          {
            "kind": "tangent",
            "title": "Why does a zero dot product mean a right angle?",
            "blocks": [
              {
                "kind": "p",
                "text": "The dot product has a second formula: $a \\cdot b = |a|\\,|b|\\cos\\theta$, where $\\theta$ is the angle between the arrows. The component formula and the angle formula are the same number. That's not obvious, so here's why."
              },
              {
                "kind": "p",
                "text": "Take the triangle with sides $a$, $b$ and $a - b$. The law of cosines says $|a-b|^2 = |a|^2 + |b|^2 - 2|a||b|\\cos\\theta$. Now expand the left side in components: $(a_x-b_x)^2 + (a_y-b_y)^2 + (a_z-b_z)^2 = |a|^2 + |b|^2 - 2(a_xb_x + a_yb_y + a_zb_z)$. Match the two and the cross terms must be equal:"
              },
              {
                "kind": "eq",
                "tex": "a_x b_x + a_y b_y + a_z b_z = |a|\\,|b|\\cos\\theta",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "So the dot product is \"how much the arrows point the same way\", scaled by their lengths. $\\cos 90° = 0$, so perpendicular arrows give 0, whatever their lengths. Parallel arrows give the largest value, opposite arrows the most negative."
              },
              {
                "kind": "p",
                "text": "This also gives <strong>projection</strong>: $a \\cdot \\hat u$, with $\\hat u$ a unit arrow, is how far $a$ reaches along $\\hat u$. We'll need exactly that to turn \"how far off the line\" into pixels."
              }
            ]
          },
          {
            "kind": "tangent",
            "title": "Where does the cross product formula come from?",
            "blocks": [
              {
                "kind": "p",
                "text": "It looks arbitrary, but it's forced. Ask for an arrow $n$ with $n \\cdot a = 0$ and $n \\cdot b = 0$. That's two equations in three unknowns, so there's a whole line of answers, all multiples of one arrow. The cross product picks the multiple whose length is the <strong>area of the parallelogram</strong> $a$ and $b$ span, $|a||b|\\sin\\theta$, pointing by the right-hand rule."
              },
              {
                "kind": "p",
                "text": "A compact way to remember it is as a determinant, with the unit arrows $\\hat x, \\hat y, \\hat z$ in the top row:"
              },
              {
                "kind": "eq",
                "tex": "a \\times b = \\det \\begin{bmatrix} \\hat x & \\hat y & \\hat z \\\\ a_x & a_y & a_z \\\\ b_x & b_y & b_z \\end{bmatrix}",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "Check it's perpendicular to $a$: $a \\cdot (a \\times b) = a_x(a_yb_z - a_zb_y) + a_y(a_zb_x - a_xb_z) + a_z(a_xb_y - a_yb_x)$. Every term cancels with another. Zero."
              },
              {
                "kind": "p",
                "text": "Two properties matter later. <strong>Order matters</strong>: $b \\times a = -(a \\times b)$. And <strong>an arrow crossed with itself is zero</strong>, $a \\times a = 0$: parallel arrows span no area. That second one is why $E$ will turn out to be a \"flattened\" matrix."
              }
            ]
          },
          {
            "kind": "tangent",
            "title": "The triple product is a determinant",
            "blocks": [
              {
                "kind": "p",
                "text": "Stack the three arrows as the rows of a matrix, and the triple product is its determinant:"
              },
              {
                "kind": "eq",
                "tex": "c \\cdot (a \\times b) = \\det \\begin{bmatrix} c_x & c_y & c_z \\\\ a_x & a_y & a_z \\\\ b_x & b_y & b_z \\end{bmatrix}",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "A determinant is the volume of the box the rows span. Zero volume means the box is squashed flat: one arrow is a mix of the other two. So \"three arrows are coplanar\", \"the triple product is zero\" and \"the determinant is zero\" are three ways of saying one thing."
              },
              {
                "kind": "p",
                "text": "Because it's a volume, you can cycle the arrows without changing it: $c\\cdot(a\\times b) = a\\cdot(b\\times c) = b\\cdot(c\\times a)$. Swapping two flips the sign. That freedom is why textbooks write the epipolar constraint in several orders and all of them are right."
              }
            ]
          }
        ]
      },
      {
        "n": 3,
        "act": "Camera",
        "title": "How a camera turns 3D into 2D",
        "subtitle": "Divide by depth, and depth is gone",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Camera at the origin, looking along z",
              "A 3D point $P = (X, Y, Z)$ lands on the image at $x = (X/Z,\\ Y/Z)$",
              "$P = (2, 1, 4)$ → $(0.5, 0.25)$. $P = (4, 2, 8)$ → also $(0.5, 0.25)$",
              "Every point on one ray lands on one pixel. A single photo throws depth away"
            ]
          },
          {
            "kind": "eq",
            "tex": "x = \\frac{P}{Z} = \\begin{bmatrix} X/Z \\\\ Y/Z \\\\ 1 \\end{bmatrix} \\qquad\\Longleftrightarrow\\qquad P = Z\\,x"
          },
          {
            "kind": "figure",
            "svg": "<svg viewBox=\"0 0 600 210\" role=\"img\" aria-label=\"Side view of a camera at the origin. A ray leaves the camera, crosses the image plane at height 0.25, and passes through the point (2, 1, 4) and then (4, 2, 8). Both points land on the same image point.\"><line x1=\"40\" y1=\"180\" x2=\"580\" y2=\"180\" class=\"zero\"/><text x=\"575\" y=\"200\" class=\"fig-label\" text-anchor=\"end\">z, depth</text><line x1=\"105\" y1=\"40\" x2=\"105\" y2=\"190\" class=\"ink\"/><text x=\"105\" y=\"30\" class=\"fig-label mid\">image plane, z = 1</text><line x1=\"40\" y1=\"180\" x2=\"580\" y2=\"45\" class=\"ray\"/><circle cx=\"40\" cy=\"180\" r=\"6\" class=\"centre\"/><text x=\"40\" y=\"202\" class=\"fig-label mid\">camera</text><circle cx=\"105\" cy=\"163.75\" r=\"5\" class=\"pt\"/><text x=\"115\" y=\"158\" class=\"fig-label\">x = (0.5, 0.25)</text><circle cx=\"300\" cy=\"115\" r=\"5\" class=\"pt\"/><text x=\"300\" y=\"138\" class=\"fig-label mid\">P = (2, 1, 4)</text><circle cx=\"560\" cy=\"50\" r=\"5\" class=\"pt\"/><text x=\"555\" y=\"78\" class=\"fig-label\" text-anchor=\"end\">2P = (4, 2, 8)</text></svg>",
            "caption": "A point and the point twice as far along the same ray land on the same pixel. The camera can't tell them apart."
          },
          {
            "kind": "explain",
            "paras": [
              "This is the pinhole camera. Light from $P$ travels in a straight line through the pinhole and hits the image plane. Put the image plane one unit in front of the pinhole (a mathematical convenience, the real sensor is behind it and the image is upside down) and similar triangles give the formula: the point is $Z$ away and $X$ to the side, so at distance 1 it's $X/Z$ to the side.",
              "Dividing by $Z$ is what makes far things small. A person 2 m away and a building 200 m away can fill the same part of the photo. That's perspective, and it's also why depth is lost: the division mixes \"how far to the side\" with \"how far away\", and from the result alone you can't separate them.",
              "<strong>The extra 1.</strong> Writing the image point as $(0.5,\\ 0.25,\\ 1)$ instead of $(0.5,\\ 0.25)$ lets us say $x = P/Z$ in one line: divide every part of $P$ by its last part. Read backwards, $P = Z x$: <strong>the 3D point is the image point stretched out by its unknown depth.</strong> We know $x$ from the photo. We don't know $Z$. Step 7 is the trick that makes $Z$ irrelevant.",
              "These are <strong>normalised</strong> coordinates: an ideal camera with focal length 1 and the centre of the image at $(0, 0)$. Real pixels come in step 8. Doing the geometry here first keeps the numbers small and the ideas clean."
            ]
          },
          {
            "kind": "tangent",
            "title": "Why the extra 1? Homogeneous coordinates",
            "blocks": [
              {
                "kind": "p",
                "text": "Writing a 2D point with three numbers, $(u, v, 1)$, is called <strong>homogeneous coordinates</strong>. The rule is that any non-zero multiple is the same point: $(0.5, 0.25, 1)$, $(2, 1, 4)$ and $(4, 2, 8)$ all mean the image point $(0.5, 0.25)$. To read one back, divide by the last number."
              },
              {
                "kind": "p",
                "text": "Look at what that means: the homogeneous image point and the 3D ray are the same object. $(2, 1, 4)$ is both \"the 3D point\" and \"its pixel, in homogeneous form\". The camera literally is the operation \"forget the scale\"."
              },
              {
                "kind": "p",
                "text": "Homogeneous coordinates make lines easy too. A line $au + bv + c = 0$ is the three numbers $(a, b, c)$, and a point is on it when $(a,b,c)\\cdot(u,v,1) = 0$. Then:"
              },
              {
                "kind": "table",
                "headers": [
                  "You want",
                  "You compute"
                ],
                "rows": [
                  [
                    "Is point $x$ on line $l$?",
                    "$l \\cdot x = 0$"
                  ],
                  [
                    "The line through two points $x_1, x_2$",
                    "$x_1 \\times x_2$"
                  ],
                  [
                    "The point where two lines $l_1, l_2$ meet",
                    "$l_1 \\times l_2$"
                  ]
                ],
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "The second row is just the cross product's job: $x_1 \\times x_2$ is perpendicular to both, so it dots to zero with both, so both points are on it. Points and lines are interchangeable in this algebra, which is why \"$E$ times a point gives a line\" in step 7 isn't a coincidence."
              },
              {
                "kind": "p",
                "text": "Parallel lines meet too: their cross product has a last part of 0, a <strong>point at infinity</strong>. That is how railway tracks meet at the horizon in a photo, and it'll come up in step 5."
              }
            ]
          }
        ]
      },
      {
        "n": 4,
        "act": "Setup",
        "title": "Two cameras, and the running example",
        "subtitle": "Rotate, then shift",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Camera 1 at the origin, looking along z",
              "Camera 2 shifted <strong>1 unit to the right</strong>, same direction, no rotation",
              "$P = (2, 1, 4)$, measured from camera 1",
              "Camera 1 sees $x = (0.5,\\ 0.25,\\ 1)$",
              "From camera 2 everything is 1 unit further left: $P' = (1, 1, 4)$, so it sees $x' = (0.25,\\ 0.25,\\ 1)$"
            ]
          },
          {
            "kind": "eq",
            "tex": "P' = R\\,P + t, \\qquad R = I,\\quad t = (-1, 0, 0)"
          },
          {
            "kind": "explain",
            "paras": [
              "To compare the two photos we need one formula that says where a point is according to camera 2, given where it is according to camera 1. In general camera 2 is both turned and moved. First <strong>rotate</strong> the point into camera 2's orientation with $R$, then <strong>shift</strong> it by $t$.",
              "In our example there's no turn, so $R = I$, the identity (\"do nothing\"). The shift is $t = (-1, 0, 0)$, because moving the camera right by 1 is the same as moving the whole world left by 1. Check: $(2,1,4) + (-1,0,0) = (1,1,4)$ ✓.",
              "<strong>What is $t$, physically?</strong> Put in camera 1's own centre, $P = (0,0,0)$. Out comes $P' = t$. So $t$ is <em>where camera 1 sits, as seen from camera 2</em>: one unit to its left. It's tempting to read $t$ as \"how camera 2 moved\", and in this example that's just the sign flipped, but once there's a rotation the two differ. Camera 2's position as seen from camera 1 is $-R^\\top t$.",
              "Worth noticing: the two image points differ only in $u$, from 0.5 to 0.25. The height $v$ didn't change. Hold onto that, it's the answer we'll derive."
            ]
          },
          {
            "kind": "tangent",
            "title": "What a rotation matrix is",
            "blocks": [
              {
                "kind": "p",
                "text": "A rotation is a 3×3 matrix whose columns are three unit arrows at right angles to each other: where the old x, y and z axes end up after the turn. Turning about the y-axis by an angle $\\theta$, for example:"
              },
              {
                "kind": "eq",
                "tex": "R_y(\\theta) = \\begin{bmatrix} \\cos\\theta & 0 & \\sin\\theta \\\\ 0 & 1 & 0 \\\\ -\\sin\\theta & 0 & \\cos\\theta \\end{bmatrix}",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "Two properties define it. <strong>$R^\\top R = I$</strong>: undoing a rotation is just the transpose, no inverse to compute. That's the dot product again: each column has length 1 and is perpendicular to the others. And <strong>$\\det R = +1$</strong>: it doesn't mirror the world."
              },
              {
                "kind": "p",
                "text": "A rotation has 3 degrees of freedom (think yaw, pitch, roll), even though it has 9 numbers. The orthogonality conditions use up the other 6. A shift has 3. So the full relative position of two cameras is 6 numbers. Keep that count in mind: the matrix we're building will only be able to recover 5 of them."
              },
              {
                "kind": "p",
                "text": "Rotations keep lengths and angles, so they keep dot and cross products: $(Ra)\\cdot(Rb) = a\\cdot b$ and $(Ra)\\times(Rb) = R(a\\times b)$. Geometry built from those two operations doesn't care which way you're facing, which is why step 5 works for any $R$, not just $I$."
              }
            ]
          }
        ]
      },
      {
        "n": 5,
        "act": "Epipolar",
        "title": "The triangle: the core idea",
        "subtitle": "Two cameras and a point are always flat",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Camera 1, camera 2 and $P$ make a <strong>triangle</strong>. A triangle is always flat",
              "That flat sheet is the <strong>epipolar plane</strong>",
              "Write its three sides as arrows, all in camera 2's coordinates, then apply the flatness test"
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Side",
              "Arrow",
              "In our example"
            ],
            "rows": [
              [
                "Camera 2 → camera 1 (baseline)",
                "$t$",
                "$(-1, 0, 0)$"
              ],
              [
                "Camera 1 → $P$ (camera 1's ray)",
                "$RP$",
                "$(2, 1, 4)$"
              ],
              [
                "Camera 2 → $P$ (camera 2's ray)",
                "$P'$",
                "$(1, 1, 4)$"
              ]
            ]
          },
          {
            "kind": "eq",
            "tex": "P' \\cdot (t \\times R P) = 0"
          },
          {
            "kind": "figure",
            "svg": "<svg viewBox=\"0 0 640 290\" role=\"img\" aria-label=\"Two cameras seen from above, one unit apart, both looking up the page. A point P and the two cameras form a shaded triangle, the epipolar plane. Other points along camera 1's ray all land on one image point in camera 1 but on different points along one line in camera 2.\"><polygon points=\"120,250 420,250 300,60\" class=\"soft\"/><text x=\"262\" y=\"236\" class=\"fig-label mid accent\">epipolar plane</text><line x1=\"40\" y1=\"200\" x2=\"220\" y2=\"200\" class=\"ink\"/><text x=\"40\" y=\"190\" class=\"fig-label\">image 1</text><line x1=\"270\" y1=\"200\" x2=\"540\" y2=\"200\" class=\"ink\"/><text x=\"540\" y=\"190\" class=\"fig-label\" text-anchor=\"end\">image 2</text><line x1=\"120\" y1=\"250\" x2=\"345\" y2=\"12.5\" class=\"ray\"/><line x1=\"420\" y1=\"250\" x2=\"300\" y2=\"60\" class=\"ray\"/><line x1=\"420\" y1=\"250\" x2=\"210\" y2=\"155\" class=\"faint\"/><line x1=\"420\" y1=\"250\" x2=\"345\" y2=\"12.5\" class=\"faint\"/><line x1=\"120\" y1=\"250\" x2=\"420\" y2=\"250\" class=\"ink\"/><text x=\"270\" y=\"268\" class=\"fig-label mid\">baseline, t</text><circle cx=\"120\" cy=\"250\" r=\"6\" class=\"centre\"/><text x=\"120\" y=\"282\" class=\"fig-label mid\">camera 1</text><circle cx=\"420\" cy=\"250\" r=\"6\" class=\"centre\"/><text x=\"420\" y=\"282\" class=\"fig-label mid\">camera 2</text><circle cx=\"300\" cy=\"60\" r=\"5\" class=\"pt\"/><text x=\"312\" y=\"62\" class=\"fig-label\">P</text><circle cx=\"210\" cy=\"155\" r=\"4\" class=\"pt\"/><circle cx=\"345\" cy=\"12.5\" r=\"4\" class=\"pt\"/><circle cx=\"167.4\" cy=\"200\" r=\"5\" class=\"pt\"/><text x=\"160\" y=\"222\" class=\"fig-label mid\">x</text><circle cx=\"301\" cy=\"200\" r=\"4\" class=\"hollow\"/><circle cx=\"388.4\" cy=\"200\" r=\"5\" class=\"pt\"/><circle cx=\"403.3\" cy=\"200\" r=\"4\" class=\"hollow\"/><text x=\"395\" y=\"222\" class=\"fig-label mid\">x′</text></svg>",
            "caption": "Seen from above. Every point along camera 1's ray lands on the same pixel $x$, but in camera 2 the candidates slide along one line. That line is where the epipolar plane cuts image 2."
          },
          {
            "kind": "explain",
            "paras": [
              "<strong>Why the arrows are $t$, $RP$ and $P'$.</strong> The flatness test needs all three arrows in one coordinate system, and camera 2's is the natural choice. The baseline from camera 2 to camera 1 is $t$, from step 4. The arrow from camera 1 to $P$ is $P$ in camera 1's axes, so in camera 2's axes it's $RP$. An arrow is a direction and a length, not a position, so it gets rotated but not shifted. Camera 2's own ray to $P$ is $P'$.",
              "And $P' = t + RP$ is the triangle closing up: walk from camera 2 to camera 1, then from camera 1 to $P$, and you're at $P$. Three arrows where one is the sum of the other two always lie in one plane.",
              "<strong>With numbers.</strong> $t \\times RP = (-1,0,0)\\times(2,1,4)$. First part: $0\\cdot4 - 0\\cdot1 = 0$. Second: $0\\cdot2 - (-1)\\cdot4 = 4$. Third: $(-1)\\cdot1 - 0\\cdot2 = -1$. So the plane's normal is $(0, 4, -1)$. Then $P'\\cdot(0,4,-1) = (1,1,4)\\cdot(0,4,-1) = 0 + 4 - 4 = 0$ ✓. The algebra says what the picture says.",
              "<strong>Why this is the key step.</strong> The baseline is the same for every point in the scene. Each point gets its own epipolar plane, but every one of those planes contains the baseline, like pages of a book hinged on its spine. Point $P$ picks out one page. Camera 1's ray lies in that page, camera 2's ray must lie in it too, and so camera 2 can only see $P$ somewhere on the line where that page meets its image."
            ]
          },
          {
            "kind": "tangent",
            "title": "Epipoles: where all the lines meet",
            "blocks": [
              {
                "kind": "p",
                "text": "The baseline pokes through each image at one point: the <strong>epipole</strong>. In image 2 it's the pixel where camera 2 would see camera 1. Since every epipolar plane contains the baseline, <strong>every epipolar line passes through the epipole</strong>. The lines fan out from it like spokes."
              },
              {
                "kind": "p",
                "text": "This gives a useful sanity check when you look at a real pair of photos: draw a few epipolar lines and they should all aim at one spot. If the camera moved forward, the epipole is near the middle of the image and the lines radiate out from it (things stream outward as you walk forward). If the camera moved sideways, the epipole is far off to the side."
              },
              {
                "kind": "p",
                "text": "In our example the camera moved <em>exactly</em> sideways, so the baseline is parallel to the images and never hits them. The epipole is a point at infinity, $(-1, 0, 0)$ in homogeneous form, and the \"spokes\" are all parallel: horizontal lines. That's the stereo rig case."
              },
              {
                "kind": "p",
                "text": "Algebraically, with $F$ from step 8: the epipole $e$ in image 1 satisfies $Fe = 0$, and $e'$ in image 2 satisfies $F^\\top e' = 0$. Since every epipolar line $l' = Fp$ goes through $e'$, $e'^\\top F p = 0$ for <em>every</em> $p$, and that's only possible if $F^\\top e' = 0$. So the epipoles are the null vectors of $F$. In our example, $E^\\top (-1,0,0) = (0,0,0)$ ✓."
              }
            ]
          }
        ]
      },
      {
        "n": 6,
        "act": "Algebra",
        "title": "Turning the cross product into a matrix",
        "subtitle": "So it can be merged with R",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "We want <strong>one matrix</strong> for the camera relationship",
              "A cross product isn't a matrix multiplication, so it can't be merged with $R$",
              "Fix: \"cross with $t$\" can be written as \"multiply by a special matrix\""
            ]
          },
          {
            "kind": "eq",
            "tex": "t \\times v = \\begin{bmatrix} t_y v_z - t_z v_y \\\\ t_z v_x - t_x v_z \\\\ t_x v_y - t_y v_x \\end{bmatrix} = \\underbrace{\\begin{bmatrix} 0 & -t_z & t_y \\\\ t_z & 0 & -t_x \\\\ -t_y & t_x & 0 \\end{bmatrix}}_{[t]_\\times} \\begin{bmatrix} v_x \\\\ v_y \\\\ v_z \\end{bmatrix}"
          },
          {
            "kind": "explain",
            "paras": [
              "With $t$ fixed and $v$ as the input, each line of the cross product is just some amount of $v_x$, plus some amount of $v_y$, plus some amount of $v_z$. That's exactly what a row of a matrix does. Read off the amounts. Row 1, $t_y v_z - t_z v_y$, is $0$ of $v_x$, $-t_z$ of $v_y$, $t_y$ of $v_z$: the row $(0, -t_z, t_y)$. Rows 2 and 3 the same way.",
              "<strong>For our $t = (-1, 0, 0)$:</strong>",
              "$$[t]_\\times = \\begin{bmatrix} 0 & 0 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & -1 & 0 \\end{bmatrix}$$",
              "Check it does the same job: times $(2,1,4)$, row 1 gives $0$, row 2 gives $1\\cdot4 = 4$, row 3 gives $-1\\cdot1 = -1$. Result $(0, 4, -1)$, the same normal as step 5 ✓.",
              "Nothing new has happened. It's the cross product rewritten so it can be multiplied together with other matrices. The constraint now reads:",
              "$$P'^\\top \\,[t]_\\times\\, R\\, P = 0$$"
            ]
          },
          {
            "kind": "tangent",
            "title": "The shape of $[t]_\\times$, and why it matters later",
            "blocks": [
              {
                "kind": "p",
                "text": "Look at $[t]_\\times$: zeros down the diagonal, and every entry is the negative of its mirror across the diagonal. That's a <strong>skew-symmetric</strong> matrix, $[t]_\\times^\\top = -[t]_\\times$. Every 3×3 skew-symmetric matrix is \"cross with something\", and this is the only place they turn up in this subject."
              },
              {
                "kind": "p",
                "text": "<strong>It flattens one direction.</strong> $[t]_\\times\\, t = t \\times t = 0$. Feed it its own arrow and you get nothing. A matrix that sends a non-zero arrow to zero has squashed 3D down to 2D: its <strong>rank is 2</strong> and its determinant is 0. Everything it outputs is perpendicular to $t$."
              },
              {
                "kind": "p",
                "text": "That carries straight into $E = [t]_\\times R$. Multiplying by a rotation can't restore the lost dimension, so <strong>$E$ has rank 2</strong>, $\\det E = 0$. Its singular values are $(|t|, |t|, 0)$: two equal, one zero. That's a real test. When RANSAC estimates $E$ or $F$ from noisy matches, the raw answer won't be exactly rank 2, and the standard fix is to force the smallest singular value to zero. A rank-3 \"$F$\" would mean epipolar lines that don't all meet at one epipole, which no pair of real cameras can produce."
              }
            ]
          }
        ]
      },
      {
        "n": 7,
        "act": "Essential",
        "title": "Removing the unknown depth",
        "subtitle": "The clever step, and the Essential matrix",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "We don't know $P$ or $P'$. We only have the image points $x$ and $x'$",
              "Use $P = Z x$ and $P' = Z' x'$ from step 3",
              "The depths come out front as plain numbers, and (positive) × (something) = 0 means something = 0",
              "<strong>The depths are gone.</strong> This only works because the right side is zero"
            ]
          },
          {
            "kind": "eq",
            "tex": "(Z' x')^\\top [t]_\\times R\\,(Z x) = Z\\, Z' \\big( x'^\\top [t]_\\times R\\, x \\big) = 0"
          },
          {
            "kind": "eq",
            "tex": "\\boxed{E = [t]_\\times R} \\qquad\\qquad \\boxed{x'^\\top E\\, x = 0}"
          },
          {
            "kind": "explain",
            "paras": [
              "This is the step that makes the whole subject work. The constraint from step 6 is about 3D points, which we never get to see. But each 3D point is its image point times an unknown number, and an unknown number multiplying something that equals zero doesn't change the fact that it equals zero. The depths are positive (the point is in front of both cameras), so they can't be the zero. The bracket must be.",
              "If the equation had been \"= 5\", this would fail: $Z Z' (\\ldots) = 5$ still depends on the depths. Constraints of the form \"something = 0\" are exactly the ones that survive not knowing the scale of things, and that's why geometry in computer vision is so full of them.",
              "<strong>Check with image points only.</strong> $R = I$, so $E = [t]_\\times$. With $x = (0.5, 0.25, 1)$: $Ex$ is row 1: $0$; row 2: $1 \\cdot 1 = 1$; row 3: $-1 \\cdot 0.25 = -0.25$. So $Ex = (0, 1, -0.25)$. Then $x'\\cdot(Ex) = 0.25\\cdot0 + 0.25\\cdot1 + 1\\cdot(-0.25) = 0$ ✓. No depth, no 3D point. Just two pixels and a matrix.",
              "$E$ is the <strong>Essential matrix</strong>: one 3×3 matrix holding everything about how the two cameras sit relative to each other, as far as two photos can tell."
            ]
          },
          {
            "kind": "tangent",
            "title": "What E can't tell you: scale",
            "blocks": [
              {
                "kind": "p",
                "text": "$x'^\\top E x = 0$ is still true if you multiply $E$ by any number. So $E$ is only known up to scale, and since $E = [t]_\\times R$, so is $t$. You can recover the <em>direction</em> the camera moved, never how far."
              },
              {
                "kind": "p",
                "text": "That's not a weakness of the method, it's a fact about photos. Film a model city with cameras 10 cm apart, or the real city with cameras 100 m apart, and with the right sizes the two pairs of photos can be identical. Nothing in the pixels says which. Real systems fix the scale from outside: a known object size, a measured baseline on a stereo rig, an IMU, GPS."
              },
              {
                "kind": "p",
                "text": "<strong>Counting.</strong> Rotation has 3 degrees of freedom, translation 3, minus 1 for the lost scale: <strong>$E$ has 5</strong>. That's why the minimal solver for $E$ needs only 5 matches (Nistér, 2004), against 8 for the simple linear method, which ignores the structure and treats all 9 entries as free (minus scale)."
              },
              {
                "kind": "p",
                "text": "The same scale freedom is why the depths $Z$ and $Z'$ could be thrown away in the first place: if everything can be scaled together, no equation that holds for all scales can contain the scale."
              }
            ]
          }
        ]
      },
      {
        "n": 8,
        "act": "Lines",
        "title": "Why $Ex$ is a line",
        "subtitle": "The payoff: point in, line out",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "A line on an image is $au + bv + c = 0$, so three numbers $(a, b, c)$",
              "$(0, 1, -0.25)$ means $v = 0.25$, a horizontal line",
              "A point $(u, v, 1)$ is on the line when $(a,b,c)\\cdot(u,v,1) = 0$, a dot product again",
              "<strong>Give $E$ a point from image 1, it gives back a line in image 2</strong>. $x'^\\top E x = 0$ says $x'$ is on it"
            ]
          },
          {
            "kind": "figure",
            "svg": "<svg viewBox=\"0 0 600 230\" role=\"img\" aria-label=\"Image 2 with the horizontal line v = 0.25. The true match at (0.25, 0.25) sits on the line; a wrong match at (0.25, 0.40) sits 0.15 below it, 75 pixels at focal length 500.\"><rect x=\"40\" y=\"20\" width=\"520\" height=\"190\" rx=\"6\" class=\"patch\"/><text x=\"52\" y=\"40\" class=\"fig-label\">image 2</text><line x1=\"40\" y1=\"115\" x2=\"560\" y2=\"115\" class=\"lineq\"/><text x=\"548\" y=\"105\" class=\"fig-label accent\" text-anchor=\"end\">Ex = (0, 1, −0.25): v = 0.25</text><circle cx=\"180\" cy=\"115\" r=\"6\" class=\"pt\"/><text x=\"196\" y=\"135\" class=\"fig-label\">true match (0.25, 0.25): 0</text><circle cx=\"180\" cy=\"169\" r=\"6\" class=\"hollow\"/><line x1=\"160\" y1=\"115\" x2=\"160\" y2=\"169\" class=\"axis\"/><text x=\"196\" y=\"174\" class=\"fig-label\">bad match (0.25, 0.40): 0.15 off, 75 px</text></svg>",
            "caption": "The match must be on the row $v = 0.25$. The true match is; the wrong one is 0.15 off, which is 75 pixels at a focal length of 500."
          },
          {
            "kind": "explain",
            "paras": [
              "Read $x'^\\top E x = 0$ in two halves. First compute $l' = Ex$, three numbers. Then $x'^\\top l' = 0$ says: $x'$ is on the line $l'$. So $E$ is a machine: <strong>point in image 1 → line in image 2</strong>. It's also a machine the other way: $l = E^\\top x'$ is the line in image 1 that $x$ must lie on.",
              "In our example $Ex = (0, 1, -0.25)$, the line $v = 0.25$. <strong>The match must be on the same row.</strong> And it is: $x' = (0.25, 0.25)$. That's the sideways camera from step 4. Slide a camera left or right and things move left or right in the picture, never up or down. That's why stereo cameras are mounted side by side and their images are \"rectified\" to make it exact: the search for a match goes from the whole image to one row.",
              "<strong>A wrong match.</strong> Say SIFT claims $x'_{\\text{bad}} = (0.25,\\ 0.40,\\ 1)$. Then $(0.25, 0.40, 1)\\cdot(0, 1, -0.25) = 0.40 - 0.25 = 0.15$. Not zero, so reject. With a focal length of 500 pixels that's 75 pixels off the line, clearly wrong.",
              "That's the test asked for in step 1. Note what it can and can't do. It catches a match that's off its line. It can't catch a wrong match that happens to land on the line, for instance a repeated window along the same row of a building. The test cuts the search from 2D to 1D; it doesn't make it 0D."
            ]
          },
          {
            "kind": "tangent",
            "title": "How far off the line, in pixels?",
            "blocks": [
              {
                "kind": "p",
                "text": "$x'^\\top E x$ isn't a distance in general. Scale the line $(a, b, c)$ by 10 and it's the same line, but the number grows 10 times. The actual distance from point $(u, v)$ to the line $au + bv + c = 0$ is:"
              },
              {
                "kind": "eq",
                "tex": "d = \\frac{|a u + b v + c|}{\\sqrt{a^2 + b^2}}",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "Why: $(a, b)$ is the line's normal direction in the image. Dividing by its length turns the dot product into a projection onto a unit arrow, which is a true distance (the projection idea from step 2's tangent)."
              },
              {
                "kind": "p",
                "text": "In our example $(a, b) = (0, 1)$ already has length 1, so the raw 0.15 happened to be the distance. In general you have to divide. RANSAC uses this distance, measured in pixels, so that \"within 2 pixels\" means the same thing for every match."
              },
              {
                "kind": "p",
                "text": "Two refinements in practice. The <strong>symmetric</strong> distance adds the distance of $x$ from its line in image 1, so neither image is favoured. The <strong>Sampson</strong> distance is a first-order estimate of the smallest total pixel movement in <em>both</em> images that would make the match exact. OpenCV uses Sampson inside its RANSAC for $F$."
              }
            ]
          },
          {
            "kind": "question",
            "text": "Exercise: move camera 2 <strong>up</strong> by 1 instead of right, so $t = (0, -1, 0)$. Before computing, guess the line from the picture. Then build $[t]_\\times$, multiply by $x = (0.5, 0.25, 1)$, and see."
          },
          {
            "kind": "tangent",
            "title": "Answer to the exercise",
            "blocks": [
              {
                "kind": "p",
                "text": "<strong>Guess first.</strong> Slide a camera up or down and things move up or down in the picture, not sideways. So the match should stay in the same <em>column</em>: a vertical line, $u = 0.5$."
              },
              {
                "kind": "p",
                "text": "<strong>Build it.</strong> $t_x = 0$, $t_y = -1$, $t_z = 0$:"
              },
              {
                "kind": "eq",
                "tex": "[t]_\\times = \\begin{bmatrix} 0 & 0 & -1 \\\\ 0 & 0 & 0 \\\\ 1 & 0 & 0 \\end{bmatrix}, \\qquad E x = \\begin{bmatrix} -1 \\\\ 0 \\\\ 0.5 \\end{bmatrix}",
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "The line $(-1, 0, 0.5)$ is $-u + 0.5 = 0$, so $u = 0.5$: vertical, through the same column ✓."
              },
              {
                "kind": "p",
                "text": "<strong>Check against the real point.</strong> $P' = (2, 1, 4) + (0, -1, 0) = (2, 0, 4)$, so $x' = (0.5, 0, 1)$. Same $u$, different $v$. And $(0.5, 0, 1)\\cdot(-1, 0, 0.5) = -0.5 + 0.5 = 0$ ✓."
              },
              {
                "kind": "p",
                "text": "The epipole is $(0, -1, 0)$, a point at infinity straight up the image, so all the epipolar lines are vertical. Sideways motion gives horizontal lines, vertical motion gives vertical ones, and motion in any other direction tips them, always pointing at the epipole."
              }
            ]
          }
        ]
      },
      {
        "n": 9,
        "act": "Fundamental",
        "title": "From ideal coordinates to real pixels",
        "subtitle": "E becomes F",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Real images are in pixels, like $(570, 365)$, not $(0.5, 0.25)$",
              "The intrinsics matrix $K$ converts: $p = Kx$, and back: $x = K^{-1}p$",
              "Substitute into $x'^\\top E x = 0$, and use $(AB)^\\top = B^\\top A^\\top$",
              "The middle becomes the <strong>Fundamental matrix</strong> $F$, which works on raw pixels"
            ]
          },
          {
            "kind": "eq",
            "tex": "K = \\begin{bmatrix} f & 0 & c_x \\\\ 0 & f & c_y \\\\ 0 & 0 & 1 \\end{bmatrix}, \\qquad p = K\\,x"
          },
          {
            "kind": "eq",
            "tex": "(K^{-1}p')^\\top E\\,(K^{-1}p) = p'^\\top \\underbrace{K^{-\\top} E\\, K^{-1}}_{F}\\, p = 0 \\qquad\\Longrightarrow\\qquad \\boxed{p'^\\top F\\, p = 0}"
          },
          {
            "kind": "explain",
            "paras": [
              "$K$ does two things to a normalised point: scale by the focal length $f$ (in pixels), then shift so that $(0, 0)$ moves from the centre of the image to the top-left corner where pixel numbering starts. With $f = 500$, $c_x = 320$, $c_y = 240$: $x = (0.5, 0.25)$ → $p = (500\\cdot0.5 + 320,\\ 500\\cdot0.25 + 240) = (570, 365)$, and $x' = (0.25, 0.25)$ → $p' = (445, 365)$. Same row in pixels too, 365 ✓.",
              "Going back is $x = K^{-1}p$. Put that into $x'^\\top E x = 0$. The one rule needed is that transposing a product flips the order, so $(K^{-1}p')^\\top = p'^\\top K^{-\\top}$. Collect the three matrices in the middle and call them $F$.",
              "<strong>Check in pixels.</strong> The pixel line is $l' = Fp = K^{-\\top}(Ex)$. We have $Ex = (0, 1, -0.25)$, and $K^{-\\top}$ maps a line $(a, b, c)$ to $(a/f,\\ b/f,\\ c - (a c_x + b c_y)/f)$. That gives $(0,\\ 0.002,\\ -0.25 - 240/500) = (0,\\ 0.002,\\ -0.73)$: the line $0.002\\,v = 0.73$, so $v = 365$ ✓. The row from step 8, now in pixels.",
              "<strong>Why this matters for RANSAC.</strong> $F$ does everything $E$ does, point in, line out, but on raw pixel coordinates. You can estimate it from SIFT matches without ever calibrating the camera. If you <em>do</em> know $K$, you can turn $F$ back into $E$ with $E = K'^\\top F K$, and from $E$ get $R$ and the direction of $t$, which is where triangulation starts."
            ]
          },
          {
            "kind": "tangent",
            "title": "What's inside K, and what F loses",
            "blocks": [
              {
                "kind": "p",
                "text": "<strong>$f$</strong> is the focal length measured in pixels: the lens's focal length divided by the size of one pixel on the sensor. A phone's main camera is typically somewhere around 0.8 to 1 times the image width. <strong>$(c_x, c_y)$</strong> is the principal point, where the optical axis hits the sensor, usually near the middle. A full $K$ can also have separate focal lengths for $x$ and $y$ and a skew term, but modern sensors make those nearly 1 and 0."
              },
              {
                "kind": "p",
                "text": "If the two photos come from different cameras, or the same camera zoomed differently, each has its own: $F = K'^{-\\top} E K^{-1}$."
              },
              {
                "kind": "p",
                "text": "<strong>Counting again.</strong> $F$ has 9 entries, minus 1 for scale, minus 1 because it's still rank 2 (multiplying $E$ by invertible matrices can't restore its lost dimension): <strong>7 degrees of freedom</strong>. $E$ had 5. The extra 2 are the camera information $F$ doesn't need to know. That's the trade: $F$ works without calibration, but it can only tell you about the cameras up to a projective distortion. You need $K$, and so $E$, to get real angles and true shapes."
              }
            ]
          }
        ]
      },
      {
        "n": 10,
        "act": "Picture",
        "title": "Why the picture and the algebra agree",
        "subtitle": "A whole ray of depths becomes one line",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Knowing only pixel $p$ in image 1, the 3D point could be anywhere along camera 1's ray",
              "Wherever it is on that ray, the triangle stays in the same flat sheet, the epipolar plane",
              "That sheet cuts image 2 along a line, and <strong>that line is $Fp$</strong>"
            ]
          },
          {
            "kind": "explain",
            "paras": [
              "This is the same fact seen from the two sides. In the figure in step 5, sliding the point along camera 1's ray doesn't move its pixel in image 1 at all, because depth is thrown away. But camera 2 sees the ray from the side, so as the point slides, its image in camera 2 sweeps out a line. That line is the image of camera 1's ray in camera 2.",
              "The algebra got the same line without ever choosing a depth, because step 7 removed the depth before it could matter. The geometric statement \"all depths at once\" and the algebraic statement \"the depth cancelled\" are one statement.",
              "One more consequence. Where along the line the match falls is exactly the depth information. In the stereo case, how far a point shifts sideways along its row (the <strong>disparity</strong>) gives its depth: for focal length $f$ and baseline $b$, $Z = f\\,b / \\text{disparity}$. In our example the shift was $570 - 445 = 125$ pixels, and $500 \\cdot 1 / 125 = 4$, the true depth of $P$ ✓. The epipolar line tells you where to look; the position on it tells you how far away the point is. That's day 3's triangulation in its simplest form."
            ]
          }
        ]
      },
      {
        "n": 11,
        "act": "RANSAC",
        "title": "How RANSAC will use this",
        "subtitle": "Where this is going; the fitting itself is still to do",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Hundreds of SIFT matches, as pixel pairs",
              "Pick 8 at random, solve for a guess of $F$",
              "For <strong>every</strong> match, compute the line $Fp$ and how many pixels $p'$ is from it",
              "Within a few pixels → <strong>inlier</strong> (green in <code>inspect_matches.py</code>). Far off → <strong>outlier</strong> (red)",
              "Repeat with new random picks, keep the $F$ the most matches agree with"
            ]
          },
          {
            "kind": "explain",
            "paras": [
              "The difficulty RANSAC solves is a chicken-and-egg one. To find the bad matches you need $F$. To compute $F$ you need good matches. A least-squares fit to all matches would be dragged off by the wrong ones, because one match 300 pixels off pulls harder than a hundred matches 1 pixel off.",
              "RANSAC sidesteps it by guessing. Take the smallest set of matches that pins $F$ down, solve exactly, and let every other match vote on whether that $F$ makes sense. A guess built from good matches gets a big agreeing crowd. A guess built from even one bad match gets a tiny one, because the lines it draws are wrong for everyone else. Then refit $F$ to the winning crowd only.",
              "<strong>Why 8?</strong> Write $p'^\\top F p = 0$ out and it's one linear equation in the 9 entries of $F$. $F$ only counts up to scale, so 8 equations pin it down. That's Longuet-Higgins's eight-point algorithm, solved with an SVD. Hartley's 1997 point was that you must first shift and rescale the pixel coordinates so they're around 1 in size; raw pixel values in the hundreds make the system badly conditioned and the answer poor."
            ]
          },
          {
            "kind": "tangent",
            "title": "How many random tries?",
            "blocks": [
              {
                "kind": "p",
                "text": "If a fraction $w$ of matches are good and each guess uses $s$ of them, a guess is all-good with chance $w^s$. To have at least one all-good guess with confidence $p$, you need $N$ tries:"
              },
              {
                "kind": "eq",
                "tex": "N = \\frac{\\log(1 - p)}{\\log(1 - w^s)}",
                "source": "ai"
              },
              {
                "kind": "table",
                "headers": [
                  "Points per guess",
                  "$w = 0.5$",
                  "$w = 0.7$"
                ],
                "rows": [
                  [
                    "8 (eight-point, $F$)",
                    "1,177",
                    "78"
                  ],
                  [
                    "7 (seven-point, $F$)",
                    "588",
                    "54"
                  ],
                  [
                    "5 (five-point, $E$)",
                    "146",
                    "26"
                  ]
                ],
                "source": "ai"
              },
              {
                "kind": "p",
                "text": "All at $p = 0.99$. Two things stand out. Fewer points per guess helps a lot, which is why the 7-point and 5-point solvers exist despite being harder to derive. And the inlier fraction matters even more: a clean set of matches (70% good) needs about 15 times fewer tries than a messy one (50% good) for the eight-point case. Since $w$ isn't known in advance, the usual trick is to start pessimistic and lower $N$ as better inlier counts turn up."
              }
            ]
          }
        ]
      },
      {
        "n": 12,
        "act": "Summary",
        "title": "The whole chain",
        "blocks": [
          {
            "kind": "board",
            "lines": [
              "Two cameras and a point make a <strong>triangle</strong>, and a triangle is <strong>flat</strong>",
              "\"Three arrows are flat\" is the equation $c \\cdot (a \\times b) = 0$",
              "The cross product becomes the matrix $[t]_\\times$, which merges with $R$ into $E$",
              "The unknown depths <strong>cancel</strong>, because the equation equals zero",
              "$E$ times a point is a <strong>line</strong>, and the match has to be on it",
              "Wrapping in $K$ moves it to pixels: $E \\to F$",
              "RANSAC throws out matches that are <strong>off their lines</strong>"
            ]
          }
        ]
      }
    ],
    "questions": [
      "How exactly is $F$ solved from 8 matches, and why does the SVD give the answer?",
      "Why does normalising the coordinates rescue the eight-point algorithm? What goes wrong without it?",
      "How is the inlier threshold chosen, and how does it depend on image size and SIFT's localisation error?",
      "What goes wrong when the scene is nearly flat, or the camera only rotates, and $F$ isn't defined properly?",
      "How do you get $R$ and $t$ back out of $E$, and how do you choose between its four possible answers?",
      "How does the five-point algorithm work, and is it worth it over eight-point inside RANSAC?",
      "How does triangulation turn a match plus $R$ and $t$ into a 3D point when the rays don't quite meet?"
    ]
  }
];
