export interface Mechanism {
  name: string;
  region: string;
  description: string;
}

export interface Section {
  title: string;
  subtitle?: string;
  bullets: string[];
  mechanisms?: Mechanism[];
  showContextDiagram?: boolean;
  showInhibitoryDiagram?: boolean;
  showDepthNeuronsDiagram?: boolean;
  showAmodalDiagram?: boolean;
  showKaniszaDiagram?: boolean;
  showDisparityCaptDiagram?: boolean;
  showDaVinciDiagram?: boolean;
  showBorderOwnershipDiagram?: boolean;
  showBrightnessDiagram?: boolean;
  showReceptiveFieldDiagram?: boolean;
  showPopOutDiagram?: boolean;
  showHighLevelPipelineDiagram?: boolean;
  showV4FunctionsDiagram?: boolean;
  showITColumnDiagram?: boolean;
  showPopulationCodingDiagram?: boolean;
  showAgnosiaDiagram?: boolean;
  showCategoryAgnosiaDiagram?: boolean;
  showFullDorsalDiagram?: boolean;
  showFullVentralDiagram?: boolean;
}

export interface Day {
  day: number;
  date: string;
  curiosityTitle: string;
  summary: string;
  bullets: string[];
  showStreamDiagrams?: boolean;
  sections?: Section[];
}

export const experiment = {
  title: "Understanding the Visual Cortex",
  duration: "7 days",
  commitment: "1 hr / day",
  status: "completed" as const,
  startDate: "2026-03-21",
  description: "How does the brain process what the eye sees? One hour a day, one question, no distractions — just following curiosity wherever it leads.",
};

export const days: Day[] = [
  {
    day: 1,
    date: "2026-03-21",
    curiosityTitle: "How does the brain begin processing vision?",
    summary: "Discovered that the brain splits visual processing into two parallel streams right from the retina: the dorsal stream (fast, spatial, action-oriented) using M-cells, and the ventral stream (slow, detailed, recognition-oriented) using P-cells. The dorsal stream operates in real-time with no memory, while the ventral stream builds meaning hierarchically.",
    bullets: [
      "Goal: understand the human visual cortex — the brain is the original inspiration for computer vision",
      "Image processing in the brain begins at the Primary Visual Cortex, which splits into two streams",
      "Dorsal stream (the \"where\" pathway) — answers \"where is this thing?\" and \"what do I do about it?\" — extremely fast",
      "Ventral stream (the \"what\" pathway) — identifies objects via color, texture, shape — takes longer to process",
      "The retina has two types of output cells: M-cells (fast) and P-cells (slow) — this is why one stream is faster than the other",
      "Dorsal stream works with M-cells, which are designed to detect changes in the scene — it starts at the retina itself",
      "MT area (Middle Temporal) is where motion is tracked and changes in the image are processed",
      "PPC (Posterior Parietal Cortex) is the GPS of the brain — builds a spatial map of the world: distance, speed, relative position",
      "PPC splits its output into action (reaching, grasping, dodging) and gaze (where to move eyes next, via motor/pre-motor cortex)",
      "Dorsal stream operates in real-time and has no memory — picking up a pen triggers automatic computation of pressure & depth before conscious awareness",
    ],
  },
  {
    day: 2,
    date: "2026-03-22",
    curiosityTitle: "What mechanisms power each visual stream?",
    summary: "Mapped out the specific mechanisms at each stage: motion energy and optical flow in the dorsal stream, hierarchical assembly and population coding in the ventral stream. Drew architectural diagrams for both pathways. Key insight: the ventral stream has more feedback connections running downward than feedforward ones running upward. The brain predicts what it should see.",
    showStreamDiagrams: true,
    bullets: [
      "Book to read: \"Principles of Neural Science\" — covers intermediate & high-level visual processing in detail",
    ],
    sections: [
      {
        title: "Dorsal Stream — \"Where / How\"",
        subtitle: "Works with M-cells (fast, transient, change-detecting). Operates in real-time with no memory.",
        bullets: [
          "Path: Retina → V1 → V2/V3 → MT/V5 → MST → PPC → Motor cortex & Frontal eye field",
        ],
        mechanisms: [
          { name: "Motion Energy", region: "MT / V5", description: "MT neurons don't see objects — they only perceive motion vectors, a bank of directional filters tracking movement" },
          { name: "Optical Flow", region: "MST", description: "Computes self-motion — how fast is the visual field changing around you?" },
          { name: "Predictive Coding", region: "PPC", description: "Doesn't track the object itself, only the prediction error — where the object should be vs where it actually is" },
          { name: "Efference Copy", region: "Motor / FEF", description: "The cancellation trick — brain subtracts self-generated motion so the world stays stable despite 3 eye movements per second" },
        ],
      },
      {
        title: "Ventral Stream — \"What\"",
        subtitle: "Works with P-cells (slower but persistent, sustained high-quality signals unlike M-cells which only respond to changes).",
        bullets: [
          "Path: Retina → LGN → V1 → V2 → V4 → IT (posterior) → Anterior IT → Amygdala & Hippocampus",
          "V2 isn't passively observing reality — it's actively constructing it. \"Perception is always a controlled hallucination\"",
          "V4 computes colour relative to surroundings, not absolute — this is colour constancy",
          "After Anterior IT, signal splits: Amygdala asks \"does what I'm seeing matter to me?\" (emotional relevance), Hippocampus stores the context — when, where, with whom",
          "Interesting: only the ventral stream actually \"sees\" the object",
        ],
        mechanisms: [
          { name: "Hierarchical Assembly", region: "V1 → IT", description: "Like a CNN — V1 detects edges, V2 contours, V4 curves, IT full objects. Each level combines neurons from the previous one" },
          { name: "Invariance", region: "V4 / IT", description: "Objects remain recognised despite changes in size, position, rotation (translational & rotational invariance)" },
          { name: "Population Coding", region: "IT", description: "Similar to probabilistic neural networks — recognition outputs a probability distribution, not a binary answer" },
          { name: "Top-down Prediction", region: "IT → V4", description: "More fibers run downward than upward — like backpropagation. IT tells V4 \"I think this is a face, expect contours here.\" Makes recognition much faster via probabilistic priors" },
        ],
      },
    ],
  },
  {
    day: 3,
    date: "2026-03-23",
    curiosityTitle: "How do neurons detect and assemble edges?",
    summary: "Dove into V1's simple and complex cells, the brain's edge detectors that work like CNN kernels. Discovered that edge detection moved closer to the cortex through evolution: mice detect edges before the cortex, cats use simple cells, but primates skip straight to complex cells. This gave us more flexibility because the cortex is plastic and connected to everything.",
    bullets: [
      "Moving deeper into the book \"Principles of Neural Science\" — starting with Chapter 23 on intermediate-level visual processing",
      "Chapter distinguishes low-level vs intermediate visual processing: computation of local orientation is low-level, contour integration is intermediate-level",
      "Intermediate-level visual processing is concerned about which boundaries & surfaces belong to a specific object and its background",
      "Think of it like the internal layers of a CNN — edges have been determined, now only the contours need to be detected",
      "\"Intermediate-level visual processing thus involves assembling local elements of an image into unified percept of objects & backgrounds\"",
      "Although determining these things is highly complex — combining different parts of the image has an astronomical number of solutions. Each relay in the visual circuitry of the brain basically has some form of \"perception\" while looking at an object, and hence we see edges/boundaries when there are none. There's slight ambiguity, and three signals help resolve it:",
    ],
    sections: [
      {
        title: "Three Signals That Resolve Visual Ambiguity",
        bullets: [
          "1) Visual cortex is context-dependent: what we perceive is based on where we are seeing it — hence we don't like \"weird\" things at weird locations",
          "2) The functional properties of neurons in the visual cortex can be altered by visual experience",
          "3) Visual processing is subject to cognitive functions such as attention, expectation, etc.",
        ],
      },
      {
        title: "V1 — First Step of Intermediate Visual Processing",
        subtitle: "Hubel & Wiesel discovered two types of cells in V1: simple and complex (which do the abstractions).",
        bullets: [
          "Edge-detecting neurons fire only when an edge is at a certain angle (say 45°) — similar to kernels in CNNs. Then deeper layers handle contours",
          "Simple cells are ON & OFF cells: when a light bar enters the receptive field (what neurons see in their local path), they go either ON or OFF",
          "Complex cells are not so rigid — they are always active and don't have an ON/OFF switch, which is why the book says complex cells might be the second step, i.e. a combination of simple cells",
        ],
      },
      {
        title: "Evolution of Edge Detection Across Species",
        subtitle: "Where edge detection happens in the visual pathway is evolution-based — different species arrange cells differently.",
        bullets: [
          "In mice, edges are detected even before the signal goes to cortex (at an extremely early stage)",
          "In cats, edge detection is moved up — edges are processed at the intermediate stage with simple cells, then go into complex cells",
          "In primates/humans, it moved much further up — we skip simple cells altogether and just process things with complex cells",
          "This is an evolutionary advantage: as edge detection happens nearer to the cortex (inside the cortex), we get much more flexibility because the cortex is plastic & connected to millions of things — hence we can \"understand & relate\" what we see",
        ],
      },
    ],
  },
  {
    day: 4,
    date: "2026-03-24",
    curiosityTitle: "How do neurons use context from their neighbours?",
    summary: "Learned that neurons don't work alone. They communicate with neighbours via horizontal connections. Contextual modulation helps distinguish real edges from noise, and inhibitory surround (end-stopping) separates object edges from background. Also discovered that without tiny involuntary eye movements (saccades), vision would literally fade to nothing.",
    bullets: [
      "Going one step further into V1 — beyond simple & complex cells, the module that kicks in is contextual modulation",
      "Until now we assumed a neuron tuned to detect 45° fires based only on its own receptive field — that's not actually true",
    ],
    sections: [
      {
        title: "Contextual Modulation",
        subtitle: "A neuron doesn't work alone — it \"talks\" to neighbouring neurons detecting the same orientation.",
        showContextDiagram: true,
        bullets: [
          "A 45°-detecting neuron also communicates with neighbours tuned to 45° via horizontal connections — this builds context about the surroundings",
          "If neighbouring neurons aren't firing (random noise), contextual modulation tells the neuron to fire more strongly — reinforcing real edges over noise",
          "This is how we see the leaves of a tree: you register the outer leaves with clear edges, but inner leaves remain blurry — you can infer their edges but don't actually perceive them sharply",
          "The common \"Attention\" mechanism in deep learning is similar to this, yet it still lacks these horizontal connections between neurons at the same level",
        ],
      },
      {
        title: "Inhibitory Surround — End-Stopping",
        subtitle: "Not every 45° line belongs to the object — it could be background. The brain handles this with inhibitory zones.",
        showInhibitoryDiagram: true,
        bullets: [
          "Inhibitory zones sit at both ends of the receptive field along the same axis",
          "Short lines stay within the excitatory zone → neuron fires strongly (likely an object edge)",
          "Long lines extend into the inhibitory zones → neuron fires weakly (likely background — backgrounds tend to have uniform, longer lines, plus textures and surfaces)",
        ],
      },
      {
        title: "Moving Stimuli & Saccades",
        bullets: [
          "Visual cortex neurons go silent if the image is perfectly stable on the retina — they need change to fire",
          "So our eyes make tiny involuntary movements called saccades to keep the image shifting on the retina",
          "This is fascinating — without constant micro-movements, vision would literally fade to nothing",
        ],
      },
      {
        title: "Next",
        bullets: [
          "Next step: understand how the brain perceives depth",
        ],
      },
    ],
  },
  {
    day: 5,
    date: "2026-03-26",
    curiosityTitle: "How does the brain perceive depth?",
    summary: "Deep dive into depth perception: three types of depth neurons, amodal completion (the brain fills in what's hidden), Kanizsa triangles (seeing edges that don't exist), disparity capture, and Da Vinci stereopsis where the absence of information itself becomes a depth signal. Also covered border ownership, brightness perception, pop-out vs serial search, and attention as the final gate.",
    bullets: [
      "Depth perception — how does the brain figure out how far away things are?",
      "We have two eyes separated by ~6 cm — this gives us binocular vision and the ability to compute depth from disparity",
      "When we fixate on an object, both eyes converge on it — zero disparity at the fixation plane. Everything else is either in front or behind",
    ],
    sections: [
      {
        title: "Three Types of Depth Neurons",
        subtitle: "The brain has specialised neurons that respond to different depth relationships relative to the fixation plane.",
        showDepthNeuronsDiagram: true,
        bullets: [
          "Tuned excitatory — fires at only one specific depth. Like a depth-selective filter",
          "Tuned inhibitory — goes silent at one specific depth, fires everywhere else. Useful for detecting the exact fixation plane (where disparity = 0)",
          "Near / Far cells — broadly tuned. Near cells fire for anything closer than fixation, far cells fire for background. Coarse depth categorisation",
        ],
      },
      {
        title: "The Occlusion Problem — Amodal Completion",
        subtitle: "A cup in front of a book — each eye sees a different part hidden. Yet we perceive one complete book, not two halves. The brain \"fills the gaps.\"",
        showAmodalDiagram: true,
        bullets: [
          "Modal perception is based on actual stimulation — what we physically see in front of our eyes",
          "Amodal perception is what we don't see — the brain just fills it in. Hence \"a-modal\" (without a mode of sensation)",
          "How does amodal completion work? Three cues: (1) Depth — closer object is in front, so brain infers continuation behind it, (2) Alignment & continuity — edges align via horizontal connections in V1, smooth continuation, (3) Contrast & texture — same colour/brightness = same object",
        ],
      },
      {
        title: "Kanizsa Triangles — Seeing Edges That Don't Exist",
        subtitle: "The brain perceives a complete triangle even though no edges are drawn — pure illusory contours from amodal completion.",
        showKaniszaDiagram: true,
        bullets: [
          "There's no direct edge between the pac-man shapes — yet the brain perceives a bright white triangle on top",
          "This demonstrates that intermediate-level vision actively constructs boundaries from partial information",
        ],
      },
      {
        title: "Global Correspondence Problem — V1 to V2",
        subtitle: "Moving one step higher: V1 handles local edge disparity, V2 handles global disparity.",
        bullets: [
          "V1 detects edges and computes basic (local) disparity — matching features between the two eyes at a small scale",
          "V2 handles global disparity — combining multiple V1 outputs to build a coherent depth map of the whole scene",
          "As scenes get more complex, local edge matching gets messy — too many possible combinations. We need global detection (V2) to resolve ambiguity",
        ],
      },
      {
        title: "Disparity Capture — Depth Propagates Across Surfaces",
        subtitle: "Depth is coherent across a surface. The brain exploits this.",
        showDisparityCaptDiagram: true,
        bullets: [
          "Brain starts with high-confidence regions: high-contrast edges, distinct features, clear texture boundaries",
          "Then propagates depth estimates outward to ambiguous regions — neighbouring regions \"capture\" their depth from confident neighbours",
          "This propagation effect is called disparity capture",
          "Stereograms & 3D films exploit exactly this — two images, one slightly shifted. One eye alone can't see depth, but together the global disparity region activates and we see 3D!",
          "The brain understands depth based on coherent observations across the visual field",
        ],
      },
      {
        title: "Da Vinci Stereopsis",
        subtitle: "Da Vinci observed that depth is analysed by things which are \"not seen\" — hidden regions.",
        showDaVinciDiagram: true,
        bullets: [
          "The brain doesn't need matching features in both eyes. The occluded area in each eye is itself a signal for depth",
          "In Da Vinci stereopsis, features appear in only one eye — there's nothing to compare it with, yet the brain still extracts depth",
          "This is remarkable — absence of information becomes information",
        ],
      },
      {
        title: "Monocular Cues — Depth With One Eye",
        bullets: [
          "Even with one eye closed, we perceive depth fairly well — because higher brain regions \"know\" the approximate size & shape of familiar objects",
          "Depth & shadows, familiar size, comparative understanding — we can \"guess\" the depth",
          "This is top-down processing: deeper regions (IT, etc.) that know what a car is tell even V1 neurons \"what to see\"",
          "There are also motion parallax (nearby things move faster) and other monocular stereopsis cues",
        ],
      },
      {
        title: "Border Ownership — Image Segmentation in V2",
        subtitle: "Based on contrast, brightness, lighting & shading, the brain performs a kind of image segmentation.",
        showBorderOwnershipDiagram: true,
        bullets: [
          "When we see a black dot on a white surface, the border belongs to the dot — not the white background",
          "The background is continuous and extends behind the dot. The dot is in front and \"owns\" its edge",
          "V2 neurons signal which side of an edge is the \"figure\" and which is the \"ground\" — this is border ownership",
          "This marks the end of depth estimation — the brain has now segmented the scene into objects and background",
        ],
      },
      {
        title: "Other Key Points from Chapter 23",
        bullets: [],
      },
      {
        title: "Colour & Brightness Are Not Fixed",
        subtitle: "We don't have \"pixel values\" — the brain uses comparative perception, not absolute measurement.",
        showBrightnessDiagram: true,
        bullets: [
          "A grey box on a white background looks darker, but the same grey on a black background looks fainter — identical pixel value, completely different perception",
          "This is why colour constancy matters — the brain always judges relative to context, never in isolation",
        ],
      },
      {
        title: "The Brain Only Responds to Edges",
        subtitle: "Most neurons don't respond to flat, uniform surfaces at all.",
        bullets: [
          "The brain only responds to edges — it then \"fills in\" the big blank surfaces between them",
          "This is remarkably efficient: instead of encoding every pixel, just encode the boundaries and let the brain interpolate the rest",
        ],
      },
      {
        title: "Classical vs Non-Classical Receptive Fields",
        showReceptiveFieldDiagram: true,
        bullets: [
          "In the classical view, neurons only activate based on what falls inside their own receptive field",
          "In the non-classical view, they have a much broader influence — via horizontal connections to same-layer neurons",
          "This is the mechanism behind contextual modulation we saw on Day 4",
        ],
      },
      {
        title: "Horizontal Connections & Feedback",
        bullets: [
          "Horizontal connections: neurons consider what their neighbours are seeing (same level, lateral communication)",
          "Feedback connections: come from the top down — higher regions tell lower regions \"what you should be seeing\"",
          "These two together explain most of the brain's ability to resolve ambiguity in visual scenes",
        ],
      },
      {
        title: "Perceptual Learning",
        subtitle: "V1 is plastic — we can actually rewire early visual processing through practice.",
        bullets: [
          "We can rewire V1 by practising specific tasks — e.g. detecting slanted lines in parallel becomes faster with training",
          "But this learning is highly specific and not really transferable to other orientations or positions",
          "This is exactly why evolution pushed processing closer to the cortex — the cortex is plastic and connected to millions of things, so it can adapt",
        ],
      },
      {
        title: "Pop-Out & Visual Search",
        subtitle: "Sometimes things jump out instantly, sometimes you have to search one by one.",
        showPopOutDiagram: true,
        bullets: [
          "A red dot among yellow dots pops out instantly — because we process basic features (colour, orientation) simultaneously across the whole image",
          "But when features are combined (searching for 9 among 6s), pop-out fails — we have to search serially, item by item",
          "Visual search is context-aware: we know what 6 and 9 mean, so context helps. But tilt the paper 90° and the contextual (top-down) signal fades — does the struggle increase when digits must be mentally rotated?",
        ],
      },
      {
        title: "Attention — The Final Gate",
        subtitle: "Similar to attention in neural networks — we might miss parts of an image that are changing because we're not paying attention.",
        bullets: [
          "Attention is the top-down signal telling us what to focus on — it selects which parts of the visual field get priority processing",
          "The top-down attention signal reaches all the way down to the last neuron in V1 — it's not just a high-level filter, it modulates the very first stages of visual processing",
          "This concludes Chapter 23 of Principles of Neural Science — intermediate-level visual processing",
        ],
      },
    ],
  },
  {
    day: 6,
    date: "2026-03-27",
    curiosityTitle: "How does seeing become knowing?",
    summary: "Entered high-level visual processing. V4 computes colour constancy and begins invariance, posterior IT builds complete object representations using overlapping columns and population coding (like vector embeddings), anterior IT connects perception to meaning. The agnosias revealed the architecture: damage different regions and different abilities break, whether perception, naming, face identity, or entire categories.",
    bullets: [
      "Entering high-level visual processing — Chapter 24 of Principles of Neural Science",
      "We already know what V1 & V2 do (intermediate-level processing) — now we move beyond, into the regions that build actual perception and meaning",
      "The ventral stream's high-level pipeline: V4 → Posterior IT → Anterior IT → Amygdala / Hippocampus — each stage adds a new layer of understanding",
    ],
    sections: [
      {
        title: "The High-Level Visual Pipeline",
        subtitle: "Four stages transform raw visual features into cognition. Each stage builds on the last — from shape to object to meaning to memory.",
        showHighLevelPipelineDiagram: true,
        bullets: [],
      },
      {
        title: "V4 — Shape, Colour Constancy & the Beginning of Invariance",
        subtitle: "V4 is the bridge between intermediate features and object perception. It does three critical things.",
        showV4FunctionsDiagram: true,
        bullets: [
          "1) Colour constancy — computes the actual colour of a surface by factoring out illumination across the whole scene. A red apple looks red in sunlight and under fluorescent light because V4 compares colour relative to the surroundings, not in isolation",
          "2) Shape & curve extraction — understands geometric properties of contours, curves, and angles. Not just detecting edges (that's V1/V2) but understanding the shape they form",
          "3) Transformation invariance begins — small changes in position, rotation, and size are tolerated. The same shape shifted slightly is still recognised as the same shape",
          "V4 also receives heavy top-down signals from IT — higher regions feed predictions back down, telling V4 what to expect",
          "Damage to V4 produces achromatopsia: total loss of colour perception while everything else (edges, motion, shape) survives — proving V4 is the dedicated colour computation centre",
        ],
      },
      {
        title: "Posterior IT — Complete Object Representation (Perception)",
        subtitle: "This is at the end of the V1 → V2 → V4 pipeline. Here, the brain builds complete object percepts — not features, but things.",
        bullets: [
          "Posterior IT neurons respond to complex things — not just colour or orientation, but a crescent with a particular texture, a hand with specific fingers extended",
          "Some IT neurons are specialised for understanding faces — dedicated face-selective regions exist here",
          "V4 begins invariance, but in IT the invariance is full — whether the face is large or small, near or far, it doesn't matter. The same neuron fires regardless",
        ],
      },
      {
        title: "IT Cortical Columns — The Architecture of Object Knowledge",
        subtitle: "Push an electrode straight down through the thickness of IT cortex — every neuron you hit responds to similar stimuli. That's a column: ~400 μm wide, running the full depth of cortex.",
        showITColumnDiagram: true,
        bullets: [
          "This columnar organisation is similar to V1 (where horizontal connections link all 45° neurons). But there's a critical difference: IT columns overlap on each other",
          "There's no distinct hard border between columns — unlike V1 where 45° neurons and 90° neurons have clear boundaries, IT columns blend into each other",
          "This overlap is not a bug — it's a feature. Columns \"share\" different aspects of objects so that the cortex, with limited neurons, can understand ~30,000 different objects. They share knowledge",
        ],
      },
      {
        title: "Population Coding — How IT Actually Recognises Objects",
        subtitle: "Same principle as artificial neural networks — this is all probabilistic, not binary.",
        showPopulationCodingDiagram: true,
        bullets: [
          "No single neuron says \"this is a face\" — instead, a population of neurons each fire at different rates, and the pattern across the population encodes the object",
          "Vector similarity happens here — the firing pattern for a cat is more similar to a dog than to a chair. Objects that share features have overlapping neural representations",
          "This is why ambiguous or partially occluded objects can still be recognised — the population code is robust to noise because it's a distributed representation",
        ],
      },
      {
        title: "Horizontal Connections in IT — Distributed Recognition",
        bullets: [
          "There are long-range horizontal connections across IT cortex — recognition isn't a single-column operation",
          "Recognising a face isn't a column thing — it's distributed. You have to combine a lot of geometrical features (eyes, nose, mouth, spacing) which are encoded across many columns",
          "This is why face recognition is so robust — the distributed representation means damage to any single column doesn't destroy the ability entirely",
        ],
      },
      {
        title: "Damage to Posterior IT — Apperceptive Agnosia",
        subtitle: "When posterior IT is damaged, perception itself fails.",
        showAgnosiaDiagram: true,
        bullets: [
          "Patients can see edges, colours, and motion (all from V1 & V2) — low-level vision is intact",
          "But they can't assemble these features into a coherent object — they can't draw anything from memory because their perception fails to create the representation",
          "They see the parts but not the whole — the binding of features into objects is broken",
        ],
      },
      {
        title: "Anterior IT — Where Percepts Connect to Meaning",
        subtitle: "Posterior IT handles perception (\"I see a face\"), but anterior IT relates it to memory (\"this face belongs to my mother\").",
        bullets: [
          "This is the transition from seeing to knowing — the percept gets connected to stored semantic knowledge",
          "Damage to anterior IT causes associative agnosia: the patient can draw an object from memory perfectly, but can't tell you what it's called or what it's used for",
          "The representation is intact (they can perceive and copy) — but the link to meaning is severed",
        ],
      },
      {
        title: "Prosopagnosia — The Face Case",
        subtitle: "A specific agnosia just for faces — patients can recognise that something is a face, see its expression, describe it in detail, but can't assign it to a person.",
        bullets: [
          "Face recognition is critical from an evolutionary standpoint — it tells us who is friend, enemy, or threat. It conveys emotions",
          "There are thousands of cortical regions dedicated to understanding patterns and subtle changes in eyes, noses, cheeks — this is a hyperfocused area for human face recognition",
          "Prosopagnosia proves that face recognition uses dedicated neural machinery separate from general object recognition",
        ],
      },
      {
        title: "Category-Specific Agnosias",
        subtitle: "Different regions of IT understand different categories of objects — and they can be selectively damaged.",
        showCategoryAgnosiaDiagram: true,
        bullets: [
          "Some patients lose the ability to recognise living things but can still recognise tools. Others lose vegetables/fruits specifically",
          "This isn't random — it's deliberate organisation. All living things share certain common traits (eyes, limbs, organic texture), so the brain groups them together",
          "Non-living things (tools, vehicles) share different traits (rigid geometry, manufactured surfaces) and are processed by different regions",
          "This category-based organisation means the brain can efficiently reuse feature detectors within a category",
        ],
      },
      {
        title: "Amygdala & Hippocampus — Vision Becomes Cognition",
        subtitle: "The final stage of the ventral stream — where visual perception connects to emotion and memory.",
        bullets: [
          "After anterior IT, the signal reaches the amygdala and hippocampus — vision is no longer just about seeing, it's about knowing and feeling",
          "The amygdala assigns emotional significance: is this face threatening? Is this object desirable?",
          "The hippocampus stores the context: when did I see this, where was I, who was I with?",
          "This is where the ventral stream's journey ends — from photons hitting the retina to a fully contextualised, emotionally tagged memory",
        ],
      },
    ],
  },
  {
    day: 7,
    date: "2026-03-28",
    curiosityTitle: "The complete architecture — how vision flows through the brain",
    summary: "Consolidated everything into two comprehensive architectural diagrams: the full dorsal stream (retina to motor action) and the full ventral stream (retina to contextualised memory). Synthesised all mechanisms, connected the dots between streams, and reflected on what the brain teaches us about computer vision.",
    bullets: [
      "Final day — consolidating everything from Days 1–6 into two comprehensive architectural diagrams, synthesising what we've learned about how the brain sees",
      "The visual cortex is not a single pipeline — it's two parallel streams that diverge from V1, each with its own purpose, speed, and computational strategy. The split begins at the retina itself: M-cells feed the dorsal stream, P-cells feed the ventral stream",
      "The dorsal stream is fast (~30–50 ms), memoryless, and action-oriented — it evolved to keep us alive in real-time. It never \"sees\" objects, only motion, space, and prediction errors",
      "The ventral stream is slow (~100–150 ms), hierarchical, and meaning-oriented — it evolved to help us understand and remember what we see. It actively constructs perception at every stage",
      "Both streams are interconnected — the dorsal stream tells the ventral stream where to look (triggering saccades), while the ventral stream tells the dorsal stream what to expect (top-down predictions). They form a closed loop, not independent pipelines",
      "Three recurring themes define visual processing: (1) the brain uses relative perception, never absolute — colour, brightness, depth are all computed by comparison; (2) feedback outnumbers feedforward — higher regions constantly predict what lower regions should see; (3) perception is a controlled hallucination — the brain fills gaps, constructs illusory edges, and resolves ambiguity at every stage",
    ],
    sections: [
      {
        title: "Dorsal Stream — Complete Architecture",
        subtitle: "The \"Where / How\" pathway. Uses M-cells (fast, transient). Operates in real-time with no memory. Purpose: spatial awareness, motion tracking, and guiding action.",
        showFullDorsalDiagram: true,
        bullets: [
          "The dorsal stream is remarkably fast because it uses M-cells — large neurons that respond to changes, not sustained input. They sacrifice detail for speed",
          "Each stage adds a layer of spatial understanding: raw motion → flow fields → spatial maps → motor commands",
          "The efference copy mechanism is crucial — without it, every eye movement would make the world appear to spin. The brain pre-cancels self-generated motion",
          "PPC doesn't just track objects — it builds a full 3D spatial model of the environment, updated in real-time",
          "The dorsal stream's output splits into two: the \"how\" pathway (grasping, reaching — via motor cortex) and the \"where\" pathway (gaze direction — via frontal eye fields)",
          "Key insight: the dorsal stream never \"sees\" objects. A ball flying toward your face triggers a dodge reflex without you ever consciously identifying it as a ball",
          "M-cells vs P-cells is a fundamental design decision made at the retina itself — the split between the two streams doesn't begin at the cortex, it begins at the eye. M-cells have large receptive fields and respond only to transient changes (onset/offset), which is why the dorsal stream is blind to static detail but lightning-fast at detecting motion",
          "Visual cortex neurons go silent if the image is perfectly stable on the retina — they need change to fire. So our eyes make tiny involuntary saccades (~3 per second) to keep the image shifting. Without these micro-movements, vision would literally fade to nothing. The dorsal stream depends on this constant micro-motion",
          "MT/V5 neurons don't track objects — they track motion vectors. They function as a bank of directional filters, each tuned to a specific direction and speed. Damage to MT causes akinetopsia: the world appears as a series of frozen snapshots rather than continuous motion. Pouring coffee becomes impossible because you can't see the liquid rising",
          "MST takes MT's local motion signals and computes global optical flow — the pattern of visual motion across the entire field. Expansion patterns mean you're moving forward, contraction means backward. This is how you know your heading direction even with your eyes closed for a moment",
          "Predictive coding in PPC is remarkably efficient: PPC doesn't encode where every object is — it only encodes the prediction error, the difference between where things should be and where they actually are. If an object moves exactly as expected, PPC barely fires. Only surprises get encoded. This is why we notice when something moves unexpectedly but can ignore predictable motion",
          "The dorsal stream also feeds into the ventral stream — it tells the ventral stream where to direct attention. When the dorsal stream detects something moving in the periphery, it triggers a saccade to that location, and the ventral stream then identifies what it is. The two streams are not independent pipelines — they form a closed loop",
        ],
      },
      {
        title: "Ventral Stream — Complete Architecture",
        subtitle: "The \"What\" pathway. Uses P-cells (slow, sustained, high-resolution). Hierarchical assembly from edges to meaning. Purpose: identification, recognition, and memory.",
        showFullVentralDiagram: true,
        bullets: [
          "The ventral stream is the brain's deep neural network — each stage builds increasingly abstract representations, from edges to objects to meaning",
          "V1 and V2 handle intermediate processing: edges, contours, depth, border ownership, figure-ground segmentation — the brain's feature extraction layers",
          "V4 is the critical bridge — it computes colour constancy, extracts shapes, and begins transformation invariance. Damage here causes achromatopsia (total colour blindness)",
          "IT cortex is where perception happens. Posterior IT builds complete object representations using overlapping columns (~400 μm wide) and population coding. No single neuron says \"face\" — the pattern across thousands of neurons encodes it",
          "Anterior IT connects perception to meaning — this is where \"seeing\" becomes \"knowing.\" Damage here causes associative agnosia: you can draw an object perfectly but can't name it",
          "The final stage connects to the amygdala (emotional significance) and hippocampus (contextual memory) — vision becomes fully integrated cognition",
          "Feedback connections outnumber feedforward ones — higher regions constantly predict what lower regions should see, making recognition faster through top-down priors",
          "The entire journey from photon hitting the retina to a contextualised, emotionally-tagged memory takes roughly 100–150 ms for the ventral stream",
          "V1's simple and complex cells are the foundation — simple cells have ON/OFF receptive fields tuned to specific orientations (like 45° edge detectors), while complex cells combine multiple simple cells to achieve position invariance. This is the first abstraction. The evolution of this is striking: mice detect edges before the cortex, cats use simple cells, but primates skip straight to complex cells — as edge detection moved closer to the cortex, it gained plasticity and connectivity",
          "Contextual modulation is a key V1 mechanism that resolves ambiguity: a neuron doesn't work alone — it communicates with neighbouring neurons detecting the same orientation via horizontal connections. If neighbours are quiet (noise), the neuron fires stronger (real edge). If neighbours are also active, it suppresses (likely texture/background). This is how we see the outer leaves of a tree sharply but inner leaves remain blurry — we infer their edges but don't actually perceive them",
          "End-stopping (inhibitory surround) is another V1 mechanism: inhibitory zones sit at both ends of a receptive field. Short lines stay within the excitatory zone → strong fire (object edge). Long lines extend into inhibitory zones → weak fire (likely background, which tends to have uniform longer lines). The brain is actively distinguishing figure from ground at the very first cortical stage",
          "V2 is where the brain begins actively constructing reality rather than passively recording it. It perceives illusory contours (Kanizsa triangles — you see a triangle where no edges exist), determines border ownership (which side of an edge is figure vs ground), and handles global disparity for depth. V2 also performs amodal completion — when a cup blocks part of a book, V2 fills in the hidden portion. Each eye sees a different hidden part, and the brain combines them into one complete object",
          "Depth perception uses three types of specialised neurons: tuned excitatory (fires at one specific depth), tuned inhibitory (silent at fixation plane, fires everywhere else), and near/far cells (coarsely categorise as closer or farther). The brain also uses disparity capture — starting from high-confidence depth points (clear edges, strong texture), it propagates depth estimates outward to ambiguous regions. Da Vinci stereopsis goes further: features visible to only one eye (the occluded region) become depth signals. Absence of information is itself information",
          "V4 computes colour constancy by comparing colour relative to surroundings, never in isolation — a red apple looks red in sunlight and under fluorescent light because V4 factors out illumination across the whole scene. The brain never uses absolute \"pixel values\" — a grey box on a white background looks darker, but the same grey on a black background looks lighter. All perception is relative, contextual, comparative",
          "The overlapping column architecture in IT is fundamentally different from V1's discrete columns. V1 has hard borders between orientation columns (45° neurons and 90° neurons are clearly separated). IT columns blend into each other — they share representations so that the cortex, with limited neurons, can recognise ~30,000 different objects. Recognition is distributed across many columns via long-range horizontal connections, not localised to one. This is why face recognition is robust to damage — no single column holds the entire representation",
          "Population coding in IT works like vector embeddings: no single neuron says \"cat\" — instead, thousands of neurons fire at different rates, and the pattern across the population encodes the object. The firing pattern for a cat is more similar to a dog than to a chair (vector similarity). Ambiguous or partially occluded objects can still be recognised because the distributed code is robust to noise",
          "The agnosias reveal the architecture through what breaks: apperceptive agnosia (posterior IT damaged) — sees edges and colours but can't assemble them into objects, can't draw from memory. Associative agnosia (anterior IT damaged) — can see and draw objects perfectly but can't name them or say what they're for, the link to meaning is severed. Prosopagnosia — can recognise that something is a face, read expressions, but can't assign it to a person. Category-specific agnosias show that IT organises objects by category — some patients lose living things but keep tools, others lose fruits specifically. Living things share traits (eyes, limbs, organic texture) and are grouped together; non-living things (rigid geometry, manufactured surfaces) are processed separately",
          "The amygdala and hippocampus represent the final transition from perception to cognition. The amygdala assigns emotional valence — is this threatening? rewarding? The hippocampus stores the episode — not just what you saw, but when, where, and who you were with. This is where visual perception becomes a fully contextualised, emotionally-tagged memory. The entire ventral stream exists to serve this endpoint: from photon to meaning",
        ],
      },
      {
        title: "Reflections — What the Brain Teaches Us About Computer Vision",
        bullets: [
          "CNNs are directly inspired by the ventral stream's hierarchical assembly: edges → contours → shapes → objects. Hubel & Wiesel's simple/complex cells from the 1960s are the intellectual ancestors of convolutional filters",
          "The brain's attention mechanism (top-down modulation reaching all the way to V1) predates transformer attention by millions of years — but the principle is the same: not all information is equally important",
          "Population coding in IT cortex is vector similarity — the same idea behind embedding spaces in modern AI. Similar objects have similar firing patterns, just as similar concepts have similar vectors",
          "The brain uses far more feedback than feedforward connections — modern AI is only beginning to explore this with iterative refinement and diffusion models",
          "Contextual modulation (horizontal connections between same-level neurons) is something attention mechanisms in deep learning still lack — neurons talk to their neighbours, not just to higher/lower layers",
          "The brain's efficiency is remarkable: it encodes only edges and fills in surfaces, uses relative (not absolute) measurements, and reuses feature detectors across categories. ~30,000 objects recognised with overlapping columns sharing knowledge",
          "Perhaps the most profound insight: perception is a controlled hallucination. The brain doesn't passively record reality — it actively constructs it, filling gaps, predicting patterns, and resolving ambiguity at every stage",
        ],
      },
    ],
  },
];
