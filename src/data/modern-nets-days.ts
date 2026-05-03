export interface CodeBlock {
  language: string;
  filename?: string;
  code: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface Section {
  title: string;
  subtitle?: string;
  bullets: string[];
  code?: CodeBlock;
  table?: TableData;
  diagram?: string;
}

export interface Day {
  day: number;
  date: string;
  curiosityTitle: string;
  summary: string;
  bullets: string[];
  diagram?: string;
  sections?: Section[];
}

export const experiment = {
  title: "Overview of Modern Nets",
  duration: "10 days (2 weeks)",
  commitment: "1 hr / day",
  status: "active" as const,
  startDate: "2026-04-27",
  description: "Revisiting transformers, tokenizers, attention, and the GPT family. Intuitive understanding, not maths. Interview prep meets genuine curiosity.",
};

export const days: Day[] = [
  {
    day: 1,
    date: "2026-04-27",
    curiosityTitle: "The encoder block, BPE, and how tokens are made",
    summary: "Starting from the encoder side of the original transformer. Residual connections, layer norm, BPE tokenization, and why byte-level BPE replaced the original. Drew the full study graph for what I need to cover.",
    bullets: [
      "Goal: learn the transformer from scratch again for interviews. Not surface level. Intuitive understanding of every piece",
      "Drew my study graph: embedding → positional encoding → multi-head attention → feedforward layers. With branches into scaled attention score and QKV method",
      "Starting with the encoder block. 6 layers in the original transformer. Residual connections skip each sublayer. Layer normalization wraps each sublayer: LayerNorm(x + sublayer(x)). I know layer norm is important but I need to understand why",
    ],
    sections: [
      {
        title: "Study graph",
        bullets: [],
        diagram: `<div class="flow-h">
  <div class="d-node">embedding</div>
  <div class="d-arrow">→</div>
  <div class="d-node">positional<br/>encoding</div>
  <div class="d-arrow">→</div>
  <div class="d-col">
    <div class="d-node">multi-head<br/>attention</div>
    <div class="d-sub">scaled attention score · QKV method</div>
  </div>
  <div class="d-arrow">→</div>
  <div class="d-node">feedforward<br/>layers</div>
</div>`,
      },
      {
        title: "BPE (Byte Pair Encoding)",
        subtitle: "A smart tokenizer where everything looks so much better than word counts",
        bullets: [
          "Pretty simple. Break each word into characters and combine the most frequent pair. Keep merging until you hit the target vocabulary size",
          "For example: newest → ['n','e','w','e','s','t'], oldest → ['o','l','d','e','s','t'], creative → ['c','r','e','a','t','i','v','e']",
          "Combine these, you can see 'e' and 's' and 't' have high frequency. So we combine them together. Keep merging tokens until we get the final number of tokens we want. We can decide how many merges we want",
          "Frequent words become single tokens: 'the' → ['the']. Rare words get split into meaningful pieces: ['un','happiness']. Unknown words don't crash the system. Morphology emerges naturally: un-, en-, pre-, -ing, -tion, -est",
          "GPT-2 onwards don't use simple BPE but a version called byte-level BPE. They convert every token to UTF-8 bytes first (256 possible byte values, 0-255) and then start combining them together. This handles Chinese and other scripts that regular BPE can't",
        ],
      },
      {
        title: "Positional embedding",
        bullets: [
          "In the original transformer they used sine-cosine waves to determine the position. This is for the 'every' dimension. So if we have 20 dimensions we will have 10 sine and 10 cosine waves",
          "This is smart but not being used anymore because it is fixed and we do need the learnable parameters",
          "In ViT we have learned positional embeddings instead of the unlearnable embeddings. I still don't fully understand how learned positional embeddings work yet",
          "I want to learn what RoPE is. First, why sine-cosine fails (RoPE is the fix for these):",
          "1) Tokens at similar positions in two different sentences get similar positional information regardless of content. 'John meeting Merry' vs 'We saw John greet Merry' — distances are similar so sine-cosine doesn't help distinguish them",
          "2) On bigger context windows it breaks down — the fixed waves weren't designed to generalise that far",
        ],
      },
      {
        title: "Input embeddings and what I need to understand",
        bullets: [
          "I need to understand the input embeddings as well. I need to understand BPE (used in original transformer)",
          "The layer normalization is important but I don't fully understand why yet",
        ],
      },
    ],
  },
  {
    day: 2,
    date: "2026-04-28",
    curiosityTitle: "Multi-head attention and why we use dot products",
    summary: "Focused on Q, K, V and the attention mechanism. Why dot products measure alignment, why we scale, and how multiple heads let the model attend to different things at once.",
    bullets: [
      "Multi-head attention is about finding the attention inside the embedding. Three things here: Q, K, and V",
      "Query: what am I looking for? Key: what do I contain? Value: what do I actually share if someone attends to me? Each of these have their own vector embeddings and all of them are learnable",
    ],
    sections: [
      {
        title: "The dot product and why it matters",
        subtitle: "How Q, K, V come together to form attention",
        bullets: [
          "After going through the 3B1B videos I want to put down a few things. A query would be a question (say in a sentence): 'hey how am I connected to the nouns?' Key would be the nouns surrounding that token. Value would be how much do I have to move my query vector to align with the query it was written on",
          "I know all this but this is too basic. I don't know how the scaling works",
          "The equation: Attention(Q,K,V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>) · V. The softmax part is called the attention matrix (before the value)",
          "We have dot product here. Dot product represents how much alignment there is between Q and K. Before softmax, we divide by √d<sub>k</sub> to scale the scores down — higher dimensions produce larger dot products which push softmax into tiny-gradient regions, so dividing by √d<sub>k</sub> keeps things stable. Softmax then converts those scaled scores into probabilities",
          "Then we do this for the V value. V is what each token actually shares when someone attends to it. And this is only for a single attention head. We have multiple attention heads",
          "After the attention head I need to understand masked attention and current tricks",
        ],
      },
    ],
  },
  {
    day: 3,
    date: "2026-04-29",
    curiosityTitle: "Masking, padding, and BERT vs GPT",
    summary: "Two types of masking in transformers. Padding masks for the encoder, causal masks for the decoder. Then compared BERT (encoder-only, bidirectional) and GPT (decoder-only, autoregressive). Now I understand the fundamental split.",
    bullets: [
      "Good enough understanding of multi-head attention now. Today's flow: understanding masking → GPT and BERT → modern variations",
      "Two types of masking in transformers",
    ],
    diagram: `<div class="flow-h">
  <div class="d-node">understanding<br/>masking</div>
  <div class="d-arrow">→</div>
  <div class="d-node">GPT &amp; BERT</div>
  <div class="d-arrow">→</div>
  <div class="d-node">modern<br/>variations</div>
</div>`,
    sections: [
      {
        title: "Encoder mask: padding mask",
        bullets: [
          "When we are doing the processing we are usually training in batches. The batch looks like this:",
          "[The] [cat] [sat] [PAD] [PAD]",
          "[I] [love] [cats] [PAD] [PAD]",
          "The [PAD] tokens contribute nothing. So we set their attention score to negative infinity, which when passed through softmax creates the value zero. These things don't contribute to the output",
        ],
      },
      {
        title: "Decoder masking: causal mask",
        bullets: [
          "Where we block the transformer from seeing the future (only next token prediction). The attention map becomes only lower triangular",
        ],
      },
      {
        title: "BERT vs GPT",
        bullets: [
          "BERT is encoder-only model. GPT is decoder-only model",
          "BERT uses the bidirectional encoder. The transformer masking learns randomly on each side (random masking). It is good for understanding the context. Classification, NER",
          "GPT is for next token prediction. Always predicts only the next token. This is why we get only the next token in GPT",
          "Now I want to dive into GPT-2 and GPT-3 and other things. I want to understand how to make these models work",
        ],
      },
      {
        title: "The GPT family study plan",
        subtitle: "Should be much better to understand now",
        bullets: [
          "GPT is Generative Pre-trained Transformer. It is decoder-only model. It works on the super pre-trained model. There are a lot of methods to do this",
        ],
        diagram: `<div class="flow-h">
  <div class="d-node">GPT<br/>meaning</div>
  <div class="d-arrow">→</div>
  <div class="d-col">
    <div class="d-node">Diff in GPT,<br/>GPT-2 &amp; 3+</div>
    <div class="d-sub">attention · masking · data · parallelisation</div>
  </div>
  <div class="d-arrow">→</div>
  <div class="d-node">Scaling &amp;<br/>nuances</div>
</div>`,
      },
    ],
  },
  {
    day: 4,
    date: "2026-04-30",
    curiosityTitle: "The transformer architecture, drawn from scratch",
    summary: "Drew the full transformer architecture diagram. Encoder layer: input embedding → positional encoding → multi-head attention → add & norm → feedforward → add & norm. Decoder adds cross-attention. Revisited the checklist of what I still need to cover.",
    bullets: [
      "My goal for today is to deep dive into transformer models. Nothing else",
      "Checklist: what are encoder models, what are decoder models, what are the training strategies, what are LLM objectives in computer vision",
    ],
    sections: [
      {
        title: "Transformer architecture (full diagram)",
        subtitle: "Drew the complete architecture from the original paper",
        bullets: [
          "I want to learn the transformer from scratch again for interviews. Starting with: 1) Tokenizer and BPE",
        ],
        diagram: `<div class="arch-diagram">
  <div class="arch-col">
    <div class="arch-label">encoder layer</div>
    <div class="arch-block">
      <div class="arch-row">Add &amp; norm</div>
      <div class="arch-row-arrow">↑</div>
      <div class="arch-row">Feed forward</div>
      <div class="arch-row-arrow">↑</div>
      <div class="arch-row">Add &amp; norm</div>
      <div class="arch-row-arrow">↑</div>
      <div class="arch-row hl">Multi-head attention</div>
    </div>
    <div class="arch-arrow">↑</div>
    <div class="arch-io">⊕ positional encoding</div>
    <div class="arch-arrow">↑</div>
    <div class="arch-io">Input embedding</div>
    <div class="arch-arrow">↑</div>
    <div class="arch-io top">Inputs</div>
  </div>
  <div class="arch-connector">
    <svg width="44" height="20" viewBox="0 0 44 20" style="color: #a0856a;">
      <line x1="0" y1="10" x2="34" y2="10" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4,2"/>
      <polygon points="34,5 44,10 34,15" fill="currentColor"/>
    </svg>
  </div>
  <div class="arch-col">
    <div class="arch-label">decoder block</div>
    <div class="arch-io top">Output</div>
    <div class="arch-arrow">↑</div>
    <div class="arch-io">Softmax</div>
    <div class="arch-arrow">↑</div>
    <div class="arch-io">Linear</div>
    <div class="arch-arrow">↑</div>
    <div class="arch-block">
      <div class="arch-row">Add &amp; norm</div>
      <div class="arch-row-arrow">↑</div>
      <div class="arch-row">Feed forward</div>
      <div class="arch-row-arrow">↑</div>
      <div class="arch-row">Add &amp; norm</div>
      <div class="arch-row-arrow">↑</div>
      <div class="arch-row hl">Multi-head attention (cross)</div>
      <div class="arch-row-arrow">↑</div>
      <div class="arch-row">Add &amp; norm</div>
      <div class="arch-row-arrow">↑</div>
      <div class="arch-row hl">Multi-head attention (masked)</div>
    </div>
    <div class="arch-arrow">↑</div>
    <div class="arch-io">⊕ positional encoding</div>
    <div class="arch-arrow">↑</div>
    <div class="arch-io">Output embedding</div>
    <div class="arch-arrow">↑</div>
    <div class="arch-io top">Outputs (shifted right)</div>
  </div>
</div>`,
      },
    ],
  },
  {
    day: 5,
    date: "2026-05-01",
    curiosityTitle: "Pretraining, feedforward, residual connections, and layer norm",
    summary: "Mapped out the full learning path from pretraining to reasoning models. Covered what pretraining actually does, Chinchilla scaling laws, feedforward as non-linearity, residual connections for gradient flow, and why layer norm beats batch norm for transformers.",
    bullets: [
      "I need to understand RAG and other things but I'll do that sequentially. Start with GPT. It's all about the decoder model (next token prediction). We have to understand pretraining first. The main difference between pre-training and GPT is pretraining it",
      "Pretraining consumes almost 90% of the compute. So that's where we start",
    ],
    sections: [
      {
        title: "Study roadmap",
        subtitle: "The path from pretraining to modern reasoning models",
        bullets: [],
        diagram: `<div class="flow-h">
  <div class="d-node">What is<br/>pretraining?</div>
  <div class="d-arrow">→</div>
  <div class="d-node">GPT<br/>evolution</div>
  <div class="d-arrow">→</div>
  <div class="d-col">
    <div class="d-node">Reasoning models<br/>(thinking models)</div>
    <div class="d-sub">gemini · claude</div>
  </div>
  <div class="d-arrow">→</div>
  <div class="d-col">
    <div class="d-node">Diff techniques</div>
    <div class="d-sub">MoE &amp; others</div>
  </div>
</div>`,
      },
      {
        title: "Pretraining",
        subtitle: "The thing that eats 90% of compute",
        bullets: [
          "Pre-training works on next token prediction. All we need to learn is the next token in the sequence. This practically gives us enormous data because there's just too much text available in books, reddit, and the web",
          "Pre-training uses Causal Language Modeling (CLM)",
          "It uses cross-entropy loss. Simple but I want to go deeper into loss functions later",
        ],
      },
      {
        title: "GPT 1 to 3 and Chinchilla",
        bullets: [
          "As we progressed from GPT-1 to GPT-3, the objective remained the same. Only data quality and parameter count increased. Also they added 100x more compute on each generation",
          "Chinchilla insight (DeepMind 2022): proved that we should train smaller models on bigger data rather than larger models on smaller data. Chinchilla (70B) outperformed GPT-3 (175B) using much more data. Since then we've been following these scaling laws",
        ],
      },
      {
        title: "What's left in the core transformer",
        subtitle: "Four blocks I haven't covered yet",
        bullets: [],
        diagram: `<div class="flow-h">
  <div class="d-node">Feed forward</div>
  <div class="d-arrow">→</div>
  <div class="d-node">Residual conn.</div>
  <div class="d-arrow">→</div>
  <div class="d-node">Layer norm</div>
  <div class="d-arrow">→</div>
  <div class="d-node">Cross attention</div>
</div>`,
      },
      {
        title: "Feedforward network",
        bullets: [
          "The main thing feedforward offers is non-linearity. The attention mechanism computes a weighted sum of values — a linear combination. Without feedforward, the model can't do complex feature transformations",
          "When we pass through the feedforward block (and during backpropagation), the mixed-up information from the attention block gets much more contextualised and reformed",
          "It's as simple as two linear layers with a non-linearity (ReLU or GELU) in between. One layer has 4x the size of the other to give the embedding (512) much more space (2048) to play in",
        ],
      },
      {
        title: "Residual connections",
        bullets: [
          "Lets information flow all the way to the last layer during backpropagation. Without them gradients vanish as the network gets deep. Pretty steady and stupidly simple — just add the input back to the output of each sublayer",
          "Post GPT-2, we add layer norm before each sublayer (pre-layernorm) instead of after (post-layernorm). This makes training much stabler",
        ],
      },
      {
        title: "Layer norm vs batch norm",
        subtitle: "Different axes, different stability",
        bullets: [
          "We have many layers and each layer depends on the layer before. To update weights of layer 5 we have to update layer 6 and so on. As we go deeper the process becomes much slower and computationally intense. This is called <strong>internal covariate shift</strong> — each layer's input distribution keeps changing because the layers before it keep updating",
          "Layer norm solves this. Instead of normalising across the batch (columns, like batch norm), it normalises across each token's features (the row)",
        ],
        diagram: `<div class="norm-diagram">
  <div class="norm-grid">
    <div class="norm-label-corner"></div>
    <div class="norm-col-header">dim 1</div>
    <div class="norm-col-header">dim 2</div>
    <div class="norm-col-header">dim 3</div>
    <div class="norm-col-header">dim 4</div>
    <div class="norm-row-label">cat</div>
    <div class="norm-cell">0.28</div><div class="norm-cell">0.38</div><div class="norm-cell">0.5</div><div class="norm-cell">0.4</div>
    <div class="norm-row-label">bat</div>
    <div class="norm-cell">0.32</div><div class="norm-cell">0.5</div><div class="norm-cell">0.85</div><div class="norm-cell">0.9</div>
    <div class="norm-row-label">sat</div>
    <div class="norm-cell">0.9</div><div class="norm-cell">0.2</div><div class="norm-cell">0.3</div><div class="norm-cell">0.8</div>
  </div>
  <div class="norm-annotations">
    <div class="norm-ann-row"><span class="norm-arrow-right">→</span> <strong>Layer norm</strong> normalises this row (each token independently)</div>
    <div class="norm-ann-col"><span class="norm-arrow-down">↓</span> <strong>Batch norm</strong> normalises this column (across the batch)</div>
  </div>
  <div class="norm-summary">
    <span>Batch norm → makes the data stable</span>
    <span>Layer norm → makes the learning stable</span>
  </div>
</div>`,
      },
    ],
  },
  {
    day: 6,
    date: "2026-05-02",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 7,
    date: "2026-05-05",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 8,
    date: "2026-05-06",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 9,
    date: "2026-05-07",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 10,
    date: "2026-05-08",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
];
