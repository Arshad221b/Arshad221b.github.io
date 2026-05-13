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
}

export interface Day {
  day: number;
  date: string;
  curiosityTitle: string;
  summary: string;
  bullets: string[];
  sections?: Section[];
}

export const experiment = {
  title: "Search Images with Words",
  duration: "4 days",
  commitment: "1 hr / day, weekdays only",
  status: "complete" as const,
  startDate: "2026-03-30",
  endDate: "2026-04-04",
  description: "How does the brain bind words to what it sees — and how do modern VLMs do the same? From neuroscience to CLIP to on-device vs cloud search to building a working prototype.",
};

export const days: Day[] = [
  {
    day: 1,
    date: "2026-03-30",
    curiosityTitle: "CLIP: the paper that married text and images",
    summary: "Starting with the foundational CLIP paper. Two separate encoders (text + image) trained with contrastive learning to produce a shared embedding space. Read introductory blogs but they weren't rigorous enough, so going straight to the paper next.",
    bullets: [
      "New project: text-to-image search. Should be straightforward to get working, but I want to actually understand the models, not just use them",
      "Goal is to compare both CLIP-style models and modern VLMs for the task. See what is different from how the human brain does it. How reliable are they, how well do they perform",
      "Starting with the most foundational paper for this: <a href='https://arxiv.org/pdf/2103.00020' target='_blank'>CLIP</a> (Radford et al., 2021). It is the combination of a text encoder and an image encoder, and what comes out is a shared representation that can be used elsewhere",
    ],
    sections: [
      {
        title: "How CLIP works",
        subtitle: "Contrastive Language-Image Pre-training: a dual-encoder that learns to place text and images in the same vector space",
        bullets: [
          "Two separate encoders that don't share weights: a Transformer for text, and either a ResNet or Vision Transformer for images",
          "Trained on 400 million (image, text) pairs from the internet. Training signal is contrastive: given a batch of N pairs, maximize cosine similarity for the N correct pairings, minimize it for the N²-N incorrect ones",
          "The result is a shared embedding space. \"A photo of a dog\" lands near actual dog images. This is what makes text-to-image search possible",
          "Zero-shot classification falls out for free: encode class labels as text, encode the image, pick the nearest. No fine-tuning needed",
          "Key insight: natural language supervision scales better than fixed label taxonomies. You don't need ImageNet categories. You just need the internet",
        ],
      },
      {
        title: "What I read",
        bullets: [
          "<a href='https://blog.roboflow.com/openai-clip/' target='_blank'>Roboflow CLIP intro</a> — decent overview but surface level. Good for first exposure, not enough for understanding the mechanism",
          "<a href='https://towardsdatascience.com/clip-intuitively-and-exhaustively-explained-1d02c07dbf40/' target='_blank'>Towards Data Science explainer</a> — more detailed but still not rigorous enough. Skips over the contrastive loss details and the ablation studies",
          "Neither blog was as rigorous as I wanted. Going straight to the <a href='https://arxiv.org/pdf/2103.00020' target='_blank'>paper</a> next. It is pretty straightforward but there is stuff I need to sit with",
        ],
      },
      {
        title: "Next steps",
        bullets: [
          "How do two separate encoders end up conveying the same thing? Completely different architectures, completely different modalities. The contrastive loss bridges them, but what does the shared space actually look like?",
          "Get something running. Pinecone for the vector store, then build the image understanding pipeline on top",
          "Zero-shot transfer: how does it work across domains? How does backbone choice (ResNet vs ViT) affect it? The paper has ablations on this",
          "Other applications beyond search (generation, segmentation) to explore later. Text-to-image search is a solid starting point",
        ],
      },
    ],
  },
  {
    day: 2,
    date: "2026-03-31",
    curiosityTitle: "CLIP's contrastive loss: how two encoders learn one space",
    summary: "Focused on the loss function side of CLIP. Two encoders produce two separate embeddings, and the contrastive loss is what forces them into a shared geometric space. Intuitive understanding only today. Low sleep so didn't go deep into the maths.",
    bullets: [
      "Two questions I wanted to answer today: how do both models get trained, and how does the loss function make them share the same space",
      "Stuck with intuitive understanding for now. Low sleep today so kept it light. The maths goes deeper but I'll come back to it",
      "Next step: understand the training procedure itself, then go deeper into VLMs intuitively",
    ],
    sections: [
      {
        title: "How the contrastive loss works",
        subtitle: "Two encoders, two embeddings, one shared space",
        bullets: [
          "There are two encoders and each one creates its own embedding. Different architectures, different modalities, different embedding spaces by default",
          "The goal is to provide structure to both of them in a shared geometric space. The loss function is what bridges the gap",
          "Cosine similarity conveys the distance between two vectors. If an \"incorrect\" text embedding has higher distance to the \"correct\" image embedding, we get high loss. That part is simple",
          "But for each text vector $t_n$ (where $n \\in N$), there are image vectors $I_n$, and the distances can be different for the other $I_{N-1}$ vectors. This is where the concept of negative loss comes in",
          "Negative loss is slightly more complicated. Didn't go deep into it today, will look into it later",
        ],
      },
      {
        title: "Two losses, one average",
        subtitle: "The final CLIP loss is symmetric",
        bullets: [
          "There are two separate losses: image-to-text ($\\ell_{i \\to t}$) and text-to-image ($\\ell_{t \\to i}$). The distance is measured in both directions",
          "The final loss is just the average of these two: $L = \\frac{\\ell_{i \\to t} + \\ell_{t \\to i}}{2}$",
          "This symmetry makes sense. The model needs to be good at matching in both directions, not just one",
        ],
      },
    ],
  },
  {
    day: 3,
    date: "2026-04-01",
    curiosityTitle: "Building CLIP from scratch: reading the paper properly",
    summary: "Decided to build CLIP from scratch. No idea how much training it will require but this experiment seems to be the only case. Spent the day reading the paper front to back. Understand the high level but have specific gaps around batch construction, contrastive loss architecture, and model scaling.",
    bullets: [
      "Building CLIP from scratch. Will try to do as much detailed work as possible. Have no idea how much training it would require but this is the way to actually learn it",
      "Starting with reading the paper. I do understand what the paper is about from first read but I still have questions",
      "In the past image models are trained on supervised labels but this is honestly pointless as we never get zero-shot capability that way. This is why I have to understand this paper properly",
    ],
    sections: [
      {
        title: "How CLIP actually works",
        subtitle: "Two encoders, one shared space, and why language makes image understanding robust",
        bullets: [
          "The model contains two encoders: text and image. These two encoders get representations from the same space which makes the image understanding robust",
          "The reason for having language training for the image model is that understanding the ambiguity of language makes training much better. For example, training on \"cat sitting on sofa\" as a full sentence. A normal image model would just get \"cat\", \"sofa\", \"sitting\" as separate labels",
          "But by allowing the model to learn the feature space just by looking at the picture, we allow our model to learn the ambiguity of this space. The sentence carries structure that isolated labels throw away",
        ],
      },
      {
        title: "Highlights from first read",
        subtitle: "Scaling, passive learning, and training efficiency",
        bullets: [
          "The authors state it is easy to scale this model compared to normal image models since there is no one-to-one mapping. Or rather, no one-to-N mapping required",
          "The language side can learn passively from supervision contained in the vast amount of text on the internet. You don't need hand-labeled data",
          "Training efficiency was key since we are training essentially two models. My question: does that mean you are training everything from scratch? The authors obviously trained every model from scratch. But what happens when I, a non-researcher, try to build this system on pre-trained models?",
        ],
      },
      {
        title: "The key insight of the paper",
        subtitle: "One paragraph that describes the entire paper",
        bullets: [
          "\"Given a batch of N (image, text) pairs, CLIP is trained to predict which of the NxN possible (image, text) pairings across a batch actually occurred. To do this, CLIP learns a multi-modal embedding space by jointly training an image encoder and text encoder to maximise the cosine similarity of the image and text embeddings of the N real pairs in the batch while minimizing the cosine similarity of the embeddings of the N²-N incorrect images.\"",
          "I want to know how this batch construction technique works. And how multi-class N-pair loss works. I want to learn about the actual architecture of this loss function",
        ],
      },
      {
        title: "Things I don't understand yet",
        subtitle: "Specific gaps to fill from the paper",
        bullets: [
          "Image representation via manifold learning (page 1)",
          "Contrastive representation learning (page 4)",
          "Difference between non-linear projection and linear projection maps, specifically for the purpose of this model (page 4)",
          "Scaling of the model. What do they mean by increasing only in one dimension (length or width)? How does it affect performance? (page 5)",
        ],
      },
    ],
  },
  {
    day: 4,
    date: "2026-04-07",
    curiosityTitle: "Zero-shot classification: from embeddings to probabilities",
    summary: "Focused on understanding the experiment section of the CLIP paper to get a clear idea of zero-shot learning and how things are actually done. This gives me enough to start working on the actual code. Also started building CLIP from scratch on the Flickr30k dataset, planning to train on my M4 Pro MacBook Pro.",
    bullets: [
      "Goal today was to understand the experiment section properly so I have a clear picture of zero-shot learning and how things are done in practice. This will give me something concrete to start working on the actual code",
      "Built my own CLIP model from scratch and trained it on the <a href='https://www.kaggle.com/datasets/hsankesara/flickr-image-dataset' target='_blank'>Flickr30k dataset</a>. Trained on my M4 Pro MacBook Pro",
      "The zero-shot pipeline is clearer now. It is enough to build a text-to-image search system",
    ],
    sections: [
      {
        title: "Zero-shot image classification pipeline",
        subtitle: "How CLIP goes from raw inputs to a prediction without ever seeing labeled training data for the task",
        bullets: [
          "Start with a zero-shot image classifier using a computer vision model. The image encoder produces an image embedding",
          "Then match the image embedding against text embeddings using cosine similarity search. This gives raw similarity scores between the image and each candidate text label",
          "Scale the similarity scores by a learned temperature parameter. Temperature controls how peaked or flat the distribution is. Higher temperature means softer probabilities, lower means sharper",
          "Normalize the scaled scores into a probability distribution via softmax. Now you have actual probabilities over the candidate labels. Pick the highest one",
          "The whole thing works because both encoders were trained to place matching pairs close together in the shared embedding space. At inference time you just measure distance",
        ],
      },
      {
        title: "Hypernetworks and on-the-fly representations",
        subtitle: "Understanding how text encodings work without pre-shared vectors",
        bullets: [
          "Wanted to understand the concept of a hypernetwork. It is another way of thinking about what happens at inference",
          "The key insight: we haven't shared any vectors anywhere ahead of time. The text encoder produces vectors on the fly from whatever text you give it. There is no fixed label set",
          "These text vectors then get matched against image vector representations which are already trained on the ambiguous, rich feature space that language supervision provides",
          "This is what makes zero-shot transfer possible. You can write any text query and get meaningful similarity scores against images the model has never seen paired with that specific text",
        ],
      },
      {
        title: "Building CLIP on Flickr30k",
        subtitle: "From-scratch implementation trained on a real dataset",
        bullets: [
          "Chose Flickr30k as the training dataset. It has 31,000 images with five captions each. Small enough to train locally, rich enough to learn real associations",
          "Completed the initial coding and trained it on my M4 Pro MacBook Pro. Apple Silicon unified memory handled the dual encoder training fine with the MPS backend",
          "This is the next concrete step from Day 3. I said I wanted to build CLIP from scratch and now I have a working model",
        ],
      },
      {
        title: "Training results",
        subtitle: "Recall metrics on Flickr30k after training",
        bullets: [
          "Text-to-image is slightly harder than image-to-text. Makes sense since multiple images can plausibly match a text description, but each image has more unique visual detail to anchor on",
        ],
        table: {
          headers: ["Metric", "Score"],
          rows: [
            ["Image-to-Text Recall@1", "58.70%"],
            ["Image-to-Text Recall@5", "85.80%"],
            ["Text-to-Image Recall@1", "54.50%"],
            ["Text-to-Image Recall@5", "84.80%"],
          ],
        },
      },
    ],
  },
];
