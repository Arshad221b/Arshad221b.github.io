export interface Section {
  title: string;
  subtitle?: string;
  bullets: string[];
  showTripartiteDiagram?: boolean;
  showEkmanDiagram?: boolean;
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
  title: "Understanding Emotion",
  duration: "7 days",
  commitment: "1 hr / day",
  status: "completed" as const,
  startDate: "2026-03-28",
  description: "What are emotions, really? Exploring the emotional and neurological sides of feeling — and why an autistic brain might process them differently.",
};

export const days: Day[] = [
  {
    day: 1,
    date: "2026-03-28",
    curiosityTitle: "What even is an emotion?",
    summary: "Plato split the soul into three warring parts 2,400 years ago. Modern science still can't agree on a single definition — but Paul Ekman's cross-cultural experiments proved that at least some emotions are hardwired, not learned.",
    bullets: [
      "The word 'emotion' has no single accepted definition — like Louis Armstrong said about jazz: 'if you have to ask what it is, you'll never know'",
      "Plato's tripartite model (Logos, Thumos, Epithumia) is surprisingly modern: reason governs, spirit enforces, appetite craves",
      "Simon Baron-Cohen catalogued close to 1,000 emotion words across languages, collapsing them into 23 mutually exclusive categories",
      "Paul Ekman's 1960s experiments with isolated tribes proved basic facial expressions are universal — not culturally learned",
      "But culture still shapes expression: Japanese and Americans feel the same emotions watching films alone, yet Japanese suppress displays when others are present",
    ],
    sections: [
      {
        title: "Plato's Tripartite Soul",
        subtitle: "Three parts of the soul, each with its own desire and virtue — written ~380 BC in The Republic",
        showTripartiteDiagram: true,
        bullets: [
          "Logos (Reason) — the highest part, seated in the head. Deals in eternal forms and universal truths. Plato argued it should govern the other two parts entirely",
          "Epithumia (Appetite) — the lowest part, seated in the belly. Drives evolutionary urges like hunger, but also includes greed and craving. Without check, it overwhelms the soul. Its virtue is Temperance: not eliminating desire, but keeping it in check",
          "Thumos (Spirit) — seated in the chest. Not just anger — it's the complex set of ambition, pride, and hunger for recognition and honour. Connected to reason: when you eat junk food and feel ashamed, that's Thumos fighting Appetite on Reason's behalf. Its virtue is Courage",
          "If trained properly, Thumos fights on Reason's side — this is Plato's model of the well-ordered soul",
        ],
      },
      {
        title: "The Problem of Defining 'Emotion'",
        subtitle: "Why psychologists gave up on a single definition and started working with examples instead",
        bullets: [
          "The book notes that the word 'emotion' has no proper, agreed-upon meaning — even specialists can't pin it down",
          "The Louis Armstrong analogy: emotion is like jazz. If you have to ask what it is, you'll never know. You recognise it when you feel it, but try defining it precisely and you fail",
          "Modern psychologists and philosophers have given up on a single watertight definition. Instead, they define emotion by listing examples and clustering them",
          "Simon Baron-Cohen (British psychologist) identified close to 1,000 emotion words and grouped them into 23 mutually exclusive categories",
          "Paul Griffiths divides emotions into three groups: basic emotions, higher cognitive emotions, and culturally specific emotions",
        ],
      },
      {
        title: "Nature vs Nurture: Ekman's Cross-Cultural Evidence",
        subtitle: "Are emotions universal biology or cultural software? A 1960s experiment in remote Papua New Guinea settled the debate — mostly",
        showEkmanDiagram: true,
        bullets: [
          "A large camp of anthropologists believed emotions were entirely learned behaviour — culturally constructed, not biologically innate",
          "This is a weak argument: there are literally different parts of the brain dedicated to recognising facial emotions. If emotions were purely learned, this neural hardware wouldn't exist",
          "If emotions were culturally learned, we wouldn't share an emotional corpus across the world — but we do",
          "Paul Ekman (one of the key scientists) tested this in the 1960s. He travelled to remote regions of Papua New Guinea where people had never seen Western media — no movies, no TV, no outside cultural influence",
          "He showed them photographs of facial expressions (happy, sad, fearful, angry, disgusted, surprised) and asked them to match the emotion",
          "They matched them perfectly — proving these basic expressions are hardwired, not learned from culture",
        ],
      },
      {
        title: "Cultural Display Rules",
        subtitle: "Emotions may be universal, but the rules about showing them are not",
        bullets: [
          "The book acknowledges there is some truth in the 'learned' side — not the emotions themselves, but the rules about expressing them",
          "Most 'emotional expression' depends on cultural norms. Japanese culture discourages open emotional display; American culture encourages it",
          "A key experiment demonstrated this beautifully: Japanese and American participants watched emotionally triggering films (evoking sadness, joy, fear, anger)",
          "When watched together with others present, Japanese participants showed little facial change compared to Americans — cultural suppression in action",
          "But when they watched the same films alone, both groups showed the same facial expressions — identical emotional responses underneath",
          "This is the critical distinction: the emotion is universal and biological, but the display rules are cultural. You feel the same thing; you just learn when to show it",
        ],
      },
    ],
  },
  {
    day: 2,
    date: "2026-03-31",
    curiosityTitle: "Are guilt and love just layered explanations?",
    summary: "The book moves into higher cognitive emotions like guilt, shame, and pride. They are universal but have directional fitting. Then comes the big debate: are some emotions culturally specific? Romantic love is the test case. One side says it is learned. The other points out 90% of cultures have it. The real complication: when you ask people to describe emotions without a fixed list, they cannot do it.",
    bullets: [
      "Second tier of emotions: higher cognitive emotions. These include guilt, shame, embarrassment, pride, envy. They go beyond the basic six from Ekman",
      "These emotions have 'directional fitting' — they point at something or someone. You are not just angry, you are guilty about X, ashamed of Y. The basic emotions do not have this targeting quality",
      "They are still universal. The reason: they are connected to neurological structures (neocortex and subcortical/basal systems) that evolved over roughly 5 million years. Biology handles most of the heavy lifting",
      "This made me wonder — are all love, guilt, shame etc just layered explanations on top of simpler base emotions?",
      "Culturally specific emotions exist too. Some authors argue certain emotions are not innate at all but are products of cultural learning and implicit social rules",
      "One interesting counterpoint: culturally specific emotions have remarkable tolerance across different cultures. If they were truly just local inventions, you would not see them pop up so widely",
      "Also, exposure to global media (movies, Netflix, books) muddies the water. Hard to say an emotion is 'culturally specific' when everyone watches the same content now",
    ],
    sections: [
      {
        title: "The Romantic Love Debate",
        subtitle: "Is romantic love a biological universal or a culturally learned concept? The answer depends on who you ask",
        bullets: [
          "Some researchers say romantic love is culturally specific — it is learned from stories, media, and social modelling. Not hardwired",
          "But another author points out that nearly 90% of cultures studied show evidence of romantic love. That is a hard number to explain with pure cultural learning",
          "The proposed definition of romantic love: a powerful feeling of anguish and longing when the loved one is absent, and intense joy when they are present",
          "My problem with this: it reads more like an observational description than a theoretical definition. It describes what love looks like, not what it is",
          "Also — this definition assumes one person. What do we call poly relationships then? The framing is narrow",
        ],
      },
      {
        title: "The Universal Ground",
        subtitle: "Both higher cognitive and culturally specific emotions land on the same conclusion",
        bullets: [
          "The common point across both categories: the emotions themselves are universal. The only real difference is how cultures express and display them",
          "Same underlying feeling, different surface behaviour. This mirrors the display rules finding from Day 1 (Japanese vs American film experiment)",
          "The 'classical' cultural context shapes how symptoms are displayed, not whether the emotion exists at all",
        ],
      },
      {
        title: "The Complication: Boxes vs Free Description",
        subtitle: "What happens when you stop giving people emotion labels to choose from",
        bullets: [
          "Standard emotion research gives people fixed options: happy, sad, angry, etc. People pick one and move on",
          "But when psychologists asked people to describe their emotions freely — no options, no list — people got confused and could not express what they felt",
          "This is a real problem. If people cannot articulate emotions without a predefined box, how much of our emotional vocabulary is just pattern matching to labels we were taught?",
          "It raises the question: do we feel in categories, or do we feel in spectrums that we then force into words?",
        ],
      },
    ],
  },
  {
    day: 3,
    date: "2026-04-01",
    curiosityTitle: "Why did evolution bother building emotions?",
    summary: "Most people think emotions are stupid or a sign of weakness. That is a naive take. Emotions are extremely complex to build. If there was no reason to have them, evolution would not have spent the energy. Every basic emotion has a clear survival purpose. Joy and distress are the motivators that keep us doing things that help us survive and reproduce. Then there is crying: only humans have emotional tears, probably because of a mutation. And higher cognitive emotions live in the neocortex while basic ones sit in the much older limbic system.",
    bullets: [
      "Emotions are not stupid. They are extremely complex to build. If evolution spent the energy, there must be a reason",
      "Every basic emotion has a clear survival function: fear, anger, surprise, disgust each map to a specific threat response",
      "Joy and distress are the deeper motivators. Without the anticipation of either, there would be no point in living",
      "We learn emotions from others too, not just from our own experience. But this has limits",
      "Only humans have emotional tears. The reason is surprisingly simple: a mutation. But why we cry at all has a more interesting answer",
      "Higher cognitive emotions sit in the neocortex. Basic emotions live in the much older limbic system",
    ],
    sections: [
      {
        title: "The Positive View of Emotions",
        subtitle: "Emotions are not bugs in human software. They are expensive biological features that evolution built for a reason",
        bullets: [
          "Most people (and even me two years ago) would think emotions are bad or not a sign of intelligence. That is naive",
          "Emotions are extremely complex to build. If there was never any reason to have them, there was no point for them to exist. That kind of emotional evolution cannot be random",
          "Otherwise, why did evolution create them? This is the 'positive view' of emotions",
        ],
      },
      {
        title: "The Survival Purpose of Each Emotion",
        subtitle: "Like we saw previously, every emotion (basic and higher cognitive) has some purpose. Here is what each one does and why evolution built it",
        bullets: [
          "<strong>Fear</strong> — to run away from danger (flight). This is the most obvious one. You see a predator, you feel fear, you run. Fear exists because ancestors who ran from threats survived. Those who did not feel fear got eaten",
          "<strong>Anger</strong> — to fight. Anger is the complement to fear. When running is not an option, anger prepares you to stand your ground and fight back. The increased heart rate, the adrenaline, the tunnel vision are all built for confrontation",
          "<strong>Surprise</strong> — response to novel stimuli. When something unexpected happens, the eyebrows arch and the eyes widen. This is not random. Widening the eyes allows you to take in as much visual information as possible. Evolution built this so you can rapidly assess whether a new situation is a threat or an opportunity",
          "<strong>Disgust</strong> — to run away from filth. Disgust keeps you from living in bacteria. The revulsion you feel toward rotting food, feces, or open wounds is evolution saying: stay away from things that carry disease. Without disgust, our ancestors would have died from infections far more often",
          "<strong>Joy</strong> — the motivator. This one is slightly more complicated. Joy is not a direct survival response like fear or anger. It is a reward signal. The reason we have sex, meet people, and receive gifts that make us joyful is that all these things were conducive to the reproductive success of our ancestors. Joy is evolution's way of saying: do more of this",
          "<strong>Distress</strong> — the inverse of joy. The reason death of a friend or loss of an important possession are so distressing is that these things were bad for the reproductive success of our ancestors. Losing allies, resources, or mates reduced your chances of survival. Distress is evolution's way of saying: avoid this",
          "Joy and distress together are the motivators to keep doing evolutionarily advantageous things. Joy pulls you toward good outcomes. Distress pushes you away from bad ones",
          "Plus, without the anticipation of joy and distress there would be no point in living. If you could not look forward to pleasure or dread pain, you would have no reason to do anything at all",
        ],
      },
      {
        title: "Learning Emotions from Others",
        subtitle: "Emotional knowledge is not limited to personal experience. We learn from watching other people",
        bullets: [
          "Children seeing their parents avoid a certain river for bathing would already learn the danger without having to try themselves",
          "But this has a limit. The learned behaviour must be under a threshold of believability. If I see my parents being superstitious, I do not automatically become superstitious",
          "Some emotional responses are deceptive. A cat with fear will have raised fur to appear larger. This is common in humans as well and is probably an evolutionary vestige from our furry ancestors",
        ],
      },
      {
        title: "Crying and the Three Kinds of Tears",
        subtitle: "Only humans have emotional tears. The reason is surprisingly simple",
        bullets: [
          "It was new to me that there are three kinds of tears: (1) basal tears which constantly lubricate the eye, (2) reflex tears triggered by irritants like smoke, and (3) emotional tears",
          "Only humans are supposed to have emotional tears. Other animals cry as well but they do not produce emotional tears",
          "Why do we cry when under distress? There is no clear theory yet but the following is convincing",
          "When you cry, emotional tears contain high levels of hormones like prolactin and adrenocorticotropic hormone. These tears also lead to reduction in cortisol while causing increased levels of endogenous opioids like endorphins. That is why we have a 'good cry' and feel slightly better",
          "Tears can also be social signaling. It is really hard to fake tears, so having tears is a solid sign that someone is in genuine distress. When we cry together it creates a kind of pure bonding",
          "Why only humans have emotional tears? A surprisingly stupid reason: mutation. Just a mutation",
        ],
      },
      {
        title: "Where Emotions Live in the Brain",
        subtitle: "Higher cognitive emotions are newer tenants in a newer building",
        bullets: [
          "Higher cognitive emotions must be much more recent than the basic emotions. They are present in the neocortex, the outer layer of the brain",
          "Basic emotions might be much older because they are present in the limbic system: hippocampus, cingulate gyrus, thalamus, and other subcortical structures",
          "This maps to the evolutionary timeline. The limbic system is ancient. The neocortex expanded much more recently, especially in humans",
        ],
      },
    ],
  },
  {
    day: 4,
    date: "2026-04-02",
    curiosityTitle: "Guilt, cheating, and why monogamy won",
    summary: "Just like other emotions we can actually understand guilt, love, and revenge. I have so much to say about this as this is my topic of interest and I would like to go deeper into it. Guilt is two-fold: it prevents you from cheating, and it signals to others that you have a conscience so they can trust you. Robert Frank argues that people known to have conscience are more trusted. Then comes the harder question: why is guilt attached to romantic emotions? The answer involves helpless babies, paternity uncertainty, social reputation, and shared responsibilities. But if guilt keeps us loyal, why does cheating still happen? Because the mate-seeking drive never fully switched off. And if polygamy is the evolutionary default, why did monogamy win? Because polygamy destabilizes societies at scale. Finally, these emotions are double-edged swords. Unrequited love is one of nature's cruellest punishments. But if guilt were easy to fake, no one would trust it, and the whole system would collapse.",
    bullets: [
      "I have so much to say about guilt because this is my topic of interest. I would like to go deeper into it than the book does",
      "There are at least two stories of guilt. First: it stops you from cheating. Second (Robert Frank): it makes others trust you. Both are evolutionary strategies",
      "I can understand guilt in transactions. But the harder question is romantic relationships. What prevents someone from leaving their partner for a more attractive one?",
      "Four evolutionary drivers keep romantic partners loyal: helpless babies, paternity uncertainty, social reputation, and reciprocal investment",
      "People still cheat because the 'I can get better' mate-seeking drive never switched off. That drive itself is an evolutionary feature",
      "Only 3-4% of mammals are monogamous. 83% of human cultures permit polygamy. But polygamy fails at scale because it destabilizes societies",
      "These emotions are double-edged swords. Unrequited love is surely one of nature's cruellest punishments. We feel too much guilt and shame when things do not work out",
      "If guilt were fakeable we would not trust guilt itself and the entire point of it would have been pointless. Guilt works because it is genuine and costly",
    ],
    sections: [
      {
        title: "Two Stories of Guilt",
        subtitle: "Guilt is at least two-fold. There are two separate evolutionary stories for why it exists, and both are convincing",
        bullets: [
          "<strong>Story 1: guilt as deterrent</strong> — this is the obvious one. If you have a conscience, the thought of the guilt you would feel afterwards is enough to prevent you from cheating in the first place. You do not need to actually experience the guilt. The anticipation alone stops you. This is guilt working inward, on yourself",
          "<strong>Story 2: guilt as trust signal (Robert Frank)</strong> — Robert Frank has a different take. He argues that people who are known to have a conscience are more likely to be trusted by others. It is not just about stopping yourself from doing bad things. It is about other people seeing that you have the capacity for guilt, and therefore choosing to cooperate with you. That is wild",
          "I agree with Frank's argument. Think about it concretely: if I do my job correctly, the people working under me will benefit. They will do their jobs better. Then those who use the products we have built will benefit as well. By the end, the entire society benefits. And hence I will benefit from it. The conscience is not just a brake. It is a signal that you are safe to cooperate with",
          "The fact that the thought of cheating is accessible to me but I still do not act on it is itself an evolutionary process. Evolution did not remove the desire to cheat. It layered guilt on top of the desire. The temptation exists, but the restraint wins",
          "It is also important to show the guilt. Not just feel it. It is important for other people to recognise that you have a conscience so that you can be 'trusted'. Guilt that nobody sees has limited social value. The display matters as much as the feeling",
        ],
      },
      {
        title: "Guilt in Romantic Relationships",
        subtitle: "I can understand the nature of guilt in transactions. But I want to think about the things that romantic partners do. What prevents them from cheating on their current partner and going to a more attractive one? Why is guilt attached to romantic emotions?",
        bullets: [
          "The answer lies in four parts. Each one is a separate evolutionary pressure that keeps romantic partners loyal",
          "<strong>Helpless babies</strong> — human babies are dumb. They require an enormous amount of care compared to other species. A human infant cannot walk, feed itself, or survive alone for years. If we had cheating partners who abandoned their families, the babies raised by single parents would have had a very low survival rate. Two committed parents meant the child was far more likely to reach adulthood. Guilt about abandoning your partner is evolution protecting the offspring",
          "<strong>Paternity uncertainty</strong> — males can never be 100% certain of paternity. Unlike females who always know the child is theirs, a male has no biological guarantee. Pair-bonding with emotional locks (guilt, jealousy, love) gives males reasonable confidence that they were investing in their own genes. Without these emotional locks, males would have no incentive to stay and provide resources. The guilt of cheating is part of the glue that holds the pair bond together so that both parents invest in children they believe are their own",
          "<strong>Social reputation</strong> — since you do not cheat, it gives you social validity. You become more socially connected. Other members of the group see you as reliable and trustworthy. In ancestral environments, being socially connected meant access to food, protection, and allies. Chances of survival are higher. Cheating risks destroying your reputation and being excluded from the group",
          "<strong>Reciprocal investment</strong> — when you are paired, you give responsibility to others and this makes you more survivable. Shared responsibilities. One partner hunts while the other guards the children. One forages while the other builds shelter. This division of labour only works if both partners stay committed. Guilt enforces the deal. If you cheat, you break the reciprocal arrangement and both partners lose the survival advantage",
        ],
      },
      {
        title: "The Mate-Seeking Drive",
        subtitle: "If guilt is such a powerful restraint, why do people still cheat? Because evolution kept another drive running in parallel",
        bullets: [
          "People still cheat because the mate-seeking drive never fully switched off. The fact that we still have an 'I can get better' instinct is not a bug. It is there for getting more evolutionary advantage. Evolution is not clean engineering. It layers conflicting drives on top of each other",
          "The guilt system says: stay loyal, protect the bond, invest in your offspring. The mate-seeking system says: there might be a genetically superior partner out there. Both systems run at the same time. Cheating happens when the mate-seeking drive temporarily overpowers the guilt system",
          "This raised a question for me about social reputation and reciprocal investment. If both are real benefits of staying paired, but the mate-seeking drive still exists, then would not polygamy be the natural state? Why is monogamy the default at all?",
        ],
      },
      {
        title: "Why Not Polygamy?",
        subtitle: "If the mate-seeking drive is real and monogamy is just one strategy, wouldn't polygamy be the norm? Turns out for most of the animal kingdom, it is",
        bullets: [
          "This was my own question after thinking about social reputation and reciprocal investment above. If loyalty gives you social validity and pair-bonding makes you more survivable, but the mate-seeking drive still exists, then would not polygamy be the natural default?",
          "The numbers are surprising. Only 3-4% of mammals are actually monogamous. And 83% of human cultures studied historically permit polygamy. So monogamy is the exception, not the rule",
          "But polygamy is not widespread in practice because it does not work on a larger scale. Three specific problems keep breaking it",
        ],
      },
      {
        title: "Polygyny: One Male, Multiple Females",
        subtitle: "The most common form of polygamy. It works for high-status males but destabilizes the entire society",
        bullets: [
          "In polygyny, high-status males have lots of access to women, giving no chance to lower-status men for reproduction. These excluded men do not just quietly accept it",
          "Having no prospect of a mate or family increases their chance of turning to crime and destabilizing the society. A large population of young men with no reproductive prospects is one of the most dangerous things a society can produce",
          "'Societies that enforced monogamy were more internally stable and could find larger, more cooperative armies, outcompeting those with polygamous cultures'",
          "Monogamy won not because it is morally superior. It won because monogamous societies were more stable and could coordinate at larger scales. This is group-level natural selection in action",
          "<strong>Resource dilution</strong> — on top of the instability problem, one father for multiple children across multiple mothers means resources get spread too thin. Each child gets less attention, less food, less protection. In ancestral environments where survival was already difficult, diluting paternal investment across many offspring reduced the survival chances of each one",
        ],
      },
      {
        title: "Polyandry: One Female, Multiple Males",
        subtitle: "Sounds good on paper. It is beneficial for offspring and for the female. But it completely fails for males, for three separate reasons",
        bullets: [
          "The idea: one female pairs with multiple males. Each child could have a dedicated father. And the female gets more partners to propagate her genes. On the surface this looks like it could work",
          "<strong>Males do not care for others' children</strong> — males are not designed to care about children that are not their own. The paternity uncertainty problem from earlier gets even worse in polyandry. If a male does not know which child is his, his motivation to invest drops to near zero. Why spend years raising a child that might carry someone else's genes?",
          "<strong>Statistically unproductive for males</strong> — a female can have only one offspring per year regardless of how many partners she has. But a male can have several offspring per year with different partners. So from the male's evolutionary perspective, polyandry is a terrible deal. He is investing maximum resources for minimal reproductive output. He would be better off leaving and finding another partner",
          "<strong>Societal factors</strong> — cultural norms, inheritance systems, and power structures all reinforce patterns that do not favour polyandry. Property, lineage, and status have historically been tracked through the male line. Polyandry breaks all of those systems",
        ],
      },
      {
        title: "The Final Answer on Polygamy",
        subtitle: "Every form of polygamy has a structural failure that prevents it from scaling",
        bullets: [
          "If we had poly relations, the trade-off is really high. Polygyny destabilizes society by creating excluded men. Resource dilution weakens offspring survival. Polyandry fails because males have no incentive to invest",
          "Monogamy is not the most exciting strategy, but it is the most stable one. It gives each person a realistic shot at a partner, keeps paternal investment focused, and produces societies that can cooperate at scale",
        ],
      },
      {
        title: "The Double-Edged Sword",
        subtitle: "These emotions are powerful precisely because they are hard to escape. That is both the feature and the cost",
        bullets: [
          "But these emotions are double-edged swords. As you can know, unrequited love is surely one of nature's cruellest punishments. You cannot choose to stop loving someone just because they do not love you back. The emotion does not have an off switch",
          "We tend to feel too much guilty, too ashamed, and waste so much time when things do not work out. A breakup can destroy months or years of someone's life. Grief over a lost relationship can feel physically painful. These are not proportionate responses to the situation. They are disproportionately intense because evolution built them to be",
          "But if the condition were opposite, where 'moving on' was easy, then the credibility of these emotions would have reduced dramatically. Think about it. If you could leave a partner and feel nothing, then your commitment means nothing. The fact that leaving hurts is what makes staying meaningful. The pain is the proof that the bond is real",
          "The fact that we can 'show' guilt is the reason for someone to trust us. If moving on were easy, that trust signal would be worthless. Nobody would believe your loyalty if they knew you could walk away without feeling a thing",
          "But what if we could just fake the guilt? If guilt was fakeable, we would not trust the guilt itself, and hence the entire point of guilt would have been pointless. The whole trust mechanism only works because guilt is genuine, involuntary, and costly. You cannot just decide to feel guilty. You either do or you do not. And that involuntary nature is exactly what makes it a reliable signal",
          "This connects back to the tears discussion from Day 3. Tears are hard to fake. Guilt is hard to fake. Emotional pain is hard to fake. Evolution specifically selected for signals that are difficult to counterfeit because only unfakeable signals can be trusted",
        ],
      },
    ],
  },
  {
    day: 5,
    date: "2026-04-05",
    curiosityTitle: "What is happiness and where does emotional pressure go?",
    summary: "Happiness is a mood, not an emotion. That distinction matters. Moods last longer, are lower intensity, and set the background state. Happiness comes from relationships, not money. Winning the lottery does not make you happier long-term. Then comes the bigger question: how do we deal with emotional pressure? Freud's hydraulic model says emotions build up and need to be vented. Language turns out to be the most powerful tool we have for this. Talking it out genuinely works, and psychotherapy is built on that principle. But there is a counter-theory: some emotions are better left untouched. If you do not revisit them, they vanish on their own. And then exposure therapy flips the whole thing again: going back to the painful place, repeatedly, until the feeling extinguishes itself. That is the basis of PTSD and OCD treatment.",
    bullets: [
      "Happiness is a mood, not an emotion. Moods are different from emotions. They last longer, are lower in intensity, and set the overall tone rather than reacting to a specific event",
      "Achieving happiness is about finding and maintaining good relationships, not about materialistic things. This connects to a book called 'The Happiness' by Daniel Haybron",
      "Having more money or winning the lottery never actually makes anyone happy long-term. After the euphoria settles, happy people return to their happiness baseline and depressed people return to depression",
      "Relationships are the thing that matters most for happiness. But humans are the only animals who have invented artificial substitutes for happiness: alcohol, drugs, and so on",
      "Freud's hydraulic model of emotions gives a mechanistic interpretation of how emotional pressure works. Emotions build up like pressure in a system and need to be released",
      "Language is a remarkably powerful tool for emotional expression. 'Talking it out' genuinely helps with distress. Psychotherapy is built on this principle",
      "But when people do not have someone to talk to, the pressure has nowhere to go. This leads to extreme acts like suicide or massive crime",
      "Counter-theory: some emotions are better not expressed or revisited. If you do not touch them, they just vanish. Exposure therapy disagrees: go back to the painful place, repeatedly, until it extinguishes. That is the basis of PTSD and OCD therapy",
    ],
    sections: [
      {
        title: "Happiness Is a Mood, Not an Emotion",
        subtitle: "The distinction between mood and emotion is not just semantic. It changes how we think about what makes us happy",
        bullets: [
          "Happiness is a mood. Mood is different from emotion. This is a key distinction the book makes",
          "A mood can last for hours or even days. An emotion is sharper, more intense, and usually tied to a specific trigger. Happiness is the background state, not a reaction to a single event",
          "When we are in a good mood, we tend to have a higher baseline. The absence of strong negative emotion is itself what makes us feel happy. Happiness is less about peaks and more about the steady state",
        ],
      },
      {
        title: "What Actually Makes Us Happy",
        subtitle: "It is not money. It is not things. The answer is boring but the evidence is overwhelming",
        bullets: [
          "Achieving happiness is, unsurprisingly, about finding and maintaining good relationships. Not about the materialistic things. This brings me back to a book called 'The Happiness' by Daniel Haybron, although the book is going to be about something different",
          "Having more money or winning the lottery never actually makes anyone happier long-term. After the euphoria has settled down, happy people get back to their happiness baseline and depressed people get back to depression. This is hedonic adaptation in action",
          "Although happiness is not the only thing that matters, relationships are the single most important factor. Everything else is secondary",
          "Humans are the only animals who have invented artificial substitutes for happiness: alcohol, drugs, and so on. Other animals do not manufacture their own mood-altering substances",
          "I remember watching a John Majors short where he describes how reducing alcohol consumption changed his baseline. 'Initially it goes down, becomes boring, but later the entire baseline goes up.' This is a perfect illustration of how artificial happiness suppressors work: they feel good in the moment but drag the baseline down over time",
        ],
      },
      {
        title: "Anxiety and the Dopamine Machines",
        subtitle: "A connection to 'The Anxious Generation' and the machines we are building",
        bullets: [
          "I want to understand the concept of anxiety here, connecting it to a book I read: 'The Anxious Generation'. Because we are building dopamine-inducing machines at an alarming rate",
          "Just like the good feeling of happiness can be artificially inflated, sadness and anxiety can be artificially amplified too. The dopamine machines (social media, phones, infinite scrolling) are doing exactly this",
          "This ties back to the happiness baseline. If artificial dopamine hits keep spiking the system, the baseline drops. The same mechanism that makes lottery winners return to normal makes chronic phone users more anxious",
        ],
      },
      {
        title: "Language as an Emotional Tool",
        subtitle: "Physical expression came first. But language changed everything about how we process emotion",
        bullets: [
          "It is fascinating that 'language' becomes a tool for our emotional expression. Not just a way to communicate ideas, but a way to process feelings",
          "Physical expressions probably came before language historically. Hugging, kissing, facial expressions. These are older, more primal forms of emotional communication",
          "But language is really a remarkable thing. It added an entirely new layer to emotional processing that physical expression alone could not provide",
          "For example, 'talking it out' helps to deal with distress. This is not just folk wisdom. Psychotherapy seems to be working on exactly this principle. The act of putting emotions into words changes how the brain processes them",
        ],
      },
      {
        title: "Freud's Hydraulic Model",
        subtitle: "Emotions as pressure in a closed system. Build up enough pressure without release and something breaks",
        bullets: [
          "Freud's theory of emotional hydraulics gives a mechanistic interpretation of human emotional expression. I am fascinated by this because it makes emotion feel like engineering",
          "Like actual hydraulics, emotions need to 'vent'. Without any external release, the internal pressure builds. And like hydraulics, when tension gets high enough, the system blows up",
          "This is something I think about a lot. When we have emotional pressure building up, having a safe place to talk it out reduces the pressure. The valve opens and the system stabilises",
          "But when people do not have someone to talk to, the pressure has nowhere to go. It leads to extreme acts: suicide, massive crime, or other destructive outlets. The system does not just stay pressurised forever. It breaks",
        ],
      },
      {
        title: "Catharsis and Identifying Trauma",
        subtitle: "Things do not just discharge on their own. You have to actively do something about them",
        bullets: [
          "Things do not just discharge on their own. You cannot be less angry by simply not thinking about it. You have to express the emotion. You have to let it out. Sometimes the word for this is 'catharsis'. It is a great term",
          "There is a logic for why identifying something that happened when you felt terrible makes it less traumatic. Naming the experience, putting it into words, structuring it into a narrative. This is not just comfort. It is a mechanism. The act of identification reduces the emotional charge",
          "This connects back to the language point. Language is not just for communication. It is for processing. Talking about a traumatic experience is not just telling someone about it. It is reorganising it in your own brain",
        ],
      },
      {
        title: "The Counter-Theory: Leave Some Emotions Alone",
        subtitle: "Not every emotion benefits from being dragged into the light. Some are better left untouched",
        bullets: [
          "But there is also a theory for unexpressed emotions that goes in the opposite direction. Some emotions are better not expressed, not confronted, not 'remembered'",
          "The idea: if you do not touch some emotions, they just vanish on their own. Do not revisit them, do not talk about them, do not give them words. They fade. I do not know exactly how to think about this, but it is a good topic to sit with",
          "This creates a genuine tension. The hydraulic model says: vent or explode. The counter-theory says: some things heal by being left alone. Both cannot be universally true. The real answer is probably that different kinds of emotional pain respond to different strategies",
        ],
      },
      {
        title: "Exposure Therapy and Extinction",
        subtitle: "Go back to the painful place. Again and again. Until the feeling dies",
        bullets: [
          "Exposure therapy takes yet another approach. Instead of venting (hydraulic model) or ignoring (counter-theory), it says: go back to the place that made you feel bad. Deliberately",
          "The idea is not to talk about the feeling but to actually revisit it. Go to the place, re-experience the context, feel the discomfort. And then do it again. And again. Until the emotional response gets extinguished",
          "This is the principle of extinction in behavioural psychology. The association between the place (or stimulus) and the bad feeling weakens with repeated exposure, as long as nothing bad actually happens during the re-exposure",
          "Exposure therapy is pretty similar to this extinction logic and is the basis of PTSD and OCD therapy. It is counterintuitive: the cure for being traumatised by something is to go back to it, not to run from it",
        ],
      },
    ],
  },
  {
    day: 6,
    date: "2026-04-06",
    curiosityTitle: "Beyond language: the other tools that shape how we feel",
    summary: "Day 5 showed that language is a powerful emotional tool. But language is not the only one. There are at least five other channels that directly affect our feelings and mood: color, food, music, chemistry, and film. Each one works differently. Some are ancient evolutionary mechanisms. Some are modern inventions that hijack those mechanisms. And some we barely understand at all. This entry is a first pass at mapping them out, with research questions I want to follow up on later.",
    bullets: [
      "As with language, there are other tools to achieve good feelings and mood. Language is one channel but the brain has many inputs",
      "Color, food, music, chemistry, and film/visuals each have their own pathway into our emotional state",
      "Some of these are deeply evolutionary (sugar cravings, color responses). Others are engineered to exploit those pathways (recreational drugs, film scoring)",
      "The three main neurotransmitters behind mood and emotion: serotonin, dopamine, and noradrenaline. I want to understand how they work individually and together",
      "Film is unique because it combines multiple emotional channels at once: visuals, music, color, story. No other art form does this. That is why directors learn from psychologists and psychologists learn from directors",
    ],
    sections: [
      {
        title: "Color",
        subtitle: "Blue light is calmer than red light for humans. But why? And how do designers use this?",
        bullets: [
          "They say blue light is much more calming than red light for humans. This is not just aesthetic preference. There is something neurological going on",
          "Red light triggers alertness and arousal. Blue light does the opposite. This maps to natural environments: red signals fire, blood, danger. Blue signals sky, water, calm",
          "I should ask designers about this. How do they use color theory to manipulate mood in interfaces, spaces, and products? There must be established principles here",
          "This connects back to the evolutionary story from Day 3. If emotions have survival purposes, then color responses probably do too. Red means threat. Blue means safety. The emotional response to color might be as hardwired as the response to a facial expression",
          "<strong>Research for later:</strong> talk to designers about how color affects mood in practice. Look into the neuroscience of color perception and emotional response. How does this connect to the visual cortex work from the neuroscience experiment?",
        ],
      },
      {
        title: "Food",
        subtitle: "We combine things to taste good. We have sugar cravings. But why does evolution want us to crave sugar?",
        bullets: [
          "We combine ingredients to make things taste good. That is obvious. But the more interesting question is: why do we have sugar cravings?",
          "Sugar cravings must have an evolutionary advantage. In ancestral environments, sweet foods (ripe fruit, honey) were rare and calorie-dense. Craving them meant you ate them when available, storing energy for lean times. The craving is a survival mechanism from when calories were scarce",
          "But now we live in a world of unlimited sugar. The craving that kept our ancestors alive is making us sick. Same pattern as the dopamine machines from Day 5. An evolved mechanism being exploited by modern abundance",
          "Food also directly affects mood. Comfort food is not just a phrase. Eating triggers serotonin and dopamine release. There is a real neurochemical pathway from food to feeling good",
          "<strong>Research for later:</strong> look into food science. Why exactly do sugar cravings exist at the neurological level? What is the evolutionary timeline? How does the gut-brain axis work in emotional regulation?",
        ],
      },
      {
        title: "Music and Sound",
        subtitle: "Classical music in stores makes people buy expensive things. Music is a direct line to emotion",
        bullets: [
          "I already know that classical music played in stores makes people buy more expensive items. This is well documented. The music changes the mood, and the mood changes the spending behaviour",
          "Music is a remarkably direct emotional tool. It bypasses rational thought entirely. You do not decide to feel sad when a minor key plays. You just feel it. That is not learned behaviour. Something about it is wired in",
          "I want to read 'Musical Human' for this. There must be deep evolutionary reasons for why sound patterns trigger emotional responses. Is it connected to voice recognition? To environmental sounds that signalled danger or safety?",
          "Music combines rhythm, melody, harmony, and timbre. Each one probably maps to a different emotional circuit. A fast rhythm increases heart rate. A low drone creates unease. These are not random associations",
          "<strong>Research for later:</strong> read 'Musical Human' book. Understand the neuroscience of why music triggers emotion. How does the auditory cortex connect to the limbic system? Why does a minor key sound sad across cultures?",
        ],
      },
      {
        title: "Chemistry: Serotonin, Dopamine, and Noradrenaline",
        subtitle: "Recreational drugs are hyper-focused tools for creating euphoria. They work because they hijack three key neurotransmitters",
        bullets: [
          "Recreational drugs are interesting from a scientific perspective because they are hyper-focused on creating euphoria. They are engineered (or naturally evolved) to be extremely good at producing acute happiness",
          "There are three key neurotransmitters behind this: serotonin, dopamine, and noradrenaline. These are the main chemical messengers that regulate mood, motivation, and arousal",
          "<strong>Dopamine</strong> is the reward and motivation chemical. It is not about pleasure itself but about the anticipation of pleasure. This connects directly to the joy discussion from Day 3. Dopamine is probably what makes joy work as a motivator",
          "<strong>Serotonin</strong> is about mood stability and well-being. Low serotonin is linked to depression. Most antidepressants (SSRIs) work by increasing serotonin availability. It is the baseline mood chemical",
          "<strong>Noradrenaline</strong> (also called norepinephrine) is about alertness and the stress response. It is the fight-or-flight chemical. This connects to the fear and anger survival purposes from Day 3",
          "I want to understand how these three work together. When you feel happy, is it all three firing? When you feel anxious, is it noradrenaline overpowering serotonin? What is the interaction model?",
          "Also: what other secretions are there? These three get the most attention, but the brain has many more chemical messengers. Endorphins (the pain-killing ones from the crying discussion in Day 3), oxytocin (the bonding one), GABA, glutamate. How do they all fit together?",
          "Drugs hijack these systems. MDMA floods serotonin. Cocaine blocks dopamine reuptake. Amphetamines increase noradrenaline. Each drug targets a specific chemical pathway to produce a specific emotional effect. That is why different drugs feel different",
          "<strong>Research for later:</strong> deep dive into how serotonin, dopamine, and noradrenaline interact. Map out all the major neurotransmitters and their emotional roles. Understand why drugs that target specific pathways produce specific emotional states",
        ],
      },
      {
        title: "Film and Visuals",
        subtitle: "Film is the art form closest to how my visual brain works. It combines every emotional channel into one experience",
        bullets: [
          "Obviously, film and creative art are the closest to my form of visual brain. I think in images. Film speaks my language",
          "What makes film unique is that it combines multiple emotional channels simultaneously: cinematic style, story line, music direction, color scheme. So many things go into a film that are not present in any other art form together",
          "A painting has color and composition but no sound. Music has melody and rhythm but no visuals. Literature has story but no direct sensory input. Film has all of them at once. It is the most complete emotional delivery system humans have built",
          "This is why directors are learning from psychologists. They need to understand how emotion works to manipulate it effectively. What camera angle creates unease? What color palette signals nostalgia? What musical cue triggers dread? These are not guesses. They are based on how the brain processes emotion",
          "And psychologists are learning from directors. Because directors have accumulated massive amounts of data about what works emotionally. Decades of audience reactions, box office results, critical analysis. Psychologists studying emotion in a lab get small sample sizes. Directors working with audiences get millions of data points",
          "This is a genuine feedback loop between art and science. Directors use psychology to make better films. Psychologists use films to study emotional responses at scale",
          "<strong>Research for later:</strong> how do film directors use psychological principles in practice? What is the science behind cinematic techniques and emotional response? How does color grading affect mood perception in film?",
        ],
      },
    ],
  },
  {
    day: 7,
    date: "2026-04-09",
    curiosityTitle: "How emotions control what you think, who you trust, and what you remember",
    summary: "The final day. Emotions are not passive. They actively distort memory, attention, and judgement. Anxious people cannot focus because anxiety is a mood that keeps the survival system running in the background. Frightened people cannot do anything else because fear is an emotion that locks every resource onto one thing. Empathy is not a mirror response. It is feeling what others feel in your body. Psychopaths have the lowest form. Highly sensitive people have the highest. The people we need are those who can manage it.",
    bullets: [
      "Emotions actively shape three core cognitive functions: memory, attention, and judgement. They are not passive feelings. They change how you think",
      "Anxiety is a mood. Fear is an emotion. This distinction explains why anxious people cannot focus (persistent background noise) while frightened people cannot do anything else (acute lockdown)",
      "Emotional events are remembered far more vividly and durably than neutral ones. The amygdala tags emotional experiences for priority storage. This is why trauma memories are so hard to shake",
      "We judge other people based on our own emotional state at the time. Meet someone when you are happy, you rate them more positively. Meet the same person when you are anxious, you rate them as less trustworthy. The person did not change. You did",
      "Empathy is not a mirror response. It is feeling what others feel in your own body. Psychopaths have the lowest form, highly sensitive people have the highest. The people we need are those who can manage empathy: feel it genuinely but still think clearly enough to act",
    ],
    sections: [
      {
        title: "Mood vs Emotion: Why This Distinction Matters for Attention",
        subtitle: "A mood is a slow burn. An emotion is an explosion. They hijack your focus in completely different ways",
        bullets: [
          "Day 5 introduced the difference between mood and emotion. Happiness is a mood. Fear is an emotion. But the distinction goes further than that. It explains why different emotional states destroy your focus in different ways",
          "<strong>Anxiety is a mood.</strong> It is low-level, persistent, and does not have a single clear trigger. When you are anxious, your body is in a mild survival state for hours or even days. The sympathetic nervous system stays slightly activated. Cortisol stays elevated. Your brain is constantly scanning for threats that may not even exist. This is why anxious people find it hard to concentrate on work, reading, or conversations. The survival scanner is running in the background, eating up cognitive resources like a program draining your battery",
          "<strong>Fear is an emotion.</strong> It is acute, intense, and tied to a specific trigger. When you are frightened, every cognitive resource locks onto the threat. Your visual field narrows. Your hearing sharpens. Your body prepares to run or fight. There is no bandwidth left for anything else. A frightened person does not struggle to focus. They hyper-focus, but only on the source of fear. Everything else disappears",
          "Here is a concrete example. Imagine you have a presentation tomorrow. If you are anxious about it, you will spend the entire evening unable to enjoy dinner, unable to read a book, unable to sleep properly. The anxiety sits in the background and poisons everything. But if a fire alarm goes off during the presentation itself, you feel fear. You stop talking. You stop thinking about the slides. Every part of you focuses on getting out of the building. The presentation does not exist anymore",
          "This maps perfectly to the survival purposes from Day 3. Fear is built for immediate threats: a predator, a falling rock, a fire. It needs total focus to survive. Anxiety is built for ongoing uncertain threats: a rival tribe nearby, food running low, social tension in the group. It needs persistent vigilance, not total focus. Evolution built two different attention-hijacking systems because the threats they address are structurally different",
          "This also explains the dopamine machines from Day 5. Social media generates chronic low-level anxiety (am I missing out? did someone respond? what are people saying about me?). It is not fear. It is mood-level anxiety that keeps the survival scanner running all day. The phone never triggers a fear response. It triggers something worse: a mood that quietly eats your ability to focus on anything else",
        ],
      },
      {
        title: "Emotions and Memory: Why You Remember the Terrible Days",
        subtitle: "The amygdala acts as an emotional highlighter. Events tagged with strong emotion get priority storage in long-term memory",
        bullets: [
          "You can probably remember exactly where you were when you heard terrible news. The room, the lighting, who told you, what you were wearing. But you cannot remember what you had for lunch last Tuesday. This is not random. Emotional events are stored differently in the brain",
          "The amygdala is the key player here. When you experience something emotionally intense, the amygdala activates and essentially tells the hippocampus: 'this one matters, store it properly.' The result is what psychologists call a <strong>flashbulb memory</strong>: vivid, detailed, and durable. People who lived through major disasters, attacks, or personal tragedies often report near-photographic recall of the moment",
          "This is an evolutionary advantage. If a particular location, animal, or situation caused you intense fear, you need to remember it in detail so you can avoid it next time. A vague memory of 'something bad happened near water' is less useful than a precise memory of exactly which river bend had the crocodile. The emotional tagging system exists to prioritise survival-relevant information",
          "But there is a cost. Traumatic memories are also stored with this priority system. This is why people with PTSD have intrusive, vivid, involuntary memories of the traumatic event. The amygdala tagged the experience as maximally important, and now the memory replays with full emotional intensity. The system that was built to help you remember the crocodile is now replaying a car accident on loop",
          "This connects to the exposure therapy discussion from Day 5. The reason exposure therapy works for PTSD is that it gradually weakens the emotional tag attached to the memory. You revisit the context without the bad thing happening, and over time the amygdala stops flagging it as dangerous. The memory remains, but the emotional charge fades. You remember the event, but it stops hijacking your body",
          "Positive emotions also enhance memory, but less dramatically. You remember your wedding day or the birth of a child more vividly than a random Tuesday. Joy tags memories for storage too, but fear and distress are stronger tags. Evolution prioritised remembering threats over remembering rewards. Forgetting a good fruit tree is inconvenient. Forgetting a predator's den is fatal",
          "There is a secondary effect too. Your current mood biases what memories you can access. When you are sad, sad memories surface more easily. When you are happy, happy memories come to mind faster. This is called <strong>mood-congruent memory</strong>. It means depression is partly self-reinforcing: the depressed mood makes it easier to recall depressing events, which deepens the depressed mood. A feedback loop",
        ],
      },
      {
        title: "Emotions and Judgement: We Do Not See People as They Are",
        subtitle: "We see people through the filter of whatever we are feeling at the time. And first impressions are almost impossible to override",
        bullets: [
          "This one is unsettling. We think we judge people based on who they are. We do not. We judge them based on how we feel when we encounter them",
          "If you meet someone at a party where you are relaxed and having a good time, you are more likely to rate them as warm, funny, and trustworthy. If you meet the exact same person on a day when you are stressed and irritable, you rate them as cold, boring, or suspicious. The person is identical. Your emotional state is the variable. This is called <strong>affect-as-information</strong>: your brain uses your current feeling as data about the external world",
          "Here is why this is dangerous. First impressions are extraordinarily sticky. Once you form an initial judgement of someone, all future information gets filtered through that judgement. This is the <strong>halo effect</strong>. If your first impression is positive (because you were in a good mood), you will interpret their future behaviour charitably. If your first impression is negative (because you were anxious or angry), you will interpret the same behaviour as confirmation that they are not trustworthy",
          "A real example. Imagine a job interview. The interviewer had a terrible morning: traffic, spilled coffee, argument with a partner. The candidate walks in and gives a perfectly good answer. But the interviewer's emotional state colours their perception. The answer seems 'okay but not great.' Another day, same interviewer, good mood: the same answer seems 'confident and well-structured.' This is not hypothetical. Studies on judicial sentencing have shown that judges give harsher sentences before lunch (when hungry and irritable) and more lenient ones after eating. The crime is the same. The judge's emotional state is the variable",
          "This also explains why conflicts escalate. If you are already angry and someone does something mildly annoying, your anger makes you interpret the action as deliberately hostile. You respond aggressively. They get angry in return. Now both people are judging each other through anger, and the situation spirals. Neither person is seeing the other clearly. They are seeing reflections of their own emotional state",
          "The practical takeaway: never make important decisions about people when you are in a strong emotional state. Do not fire someone when you are angry. Do not hire someone because they made you laugh. Do not end a relationship during a depressive episode. The emotion is real, but the judgement it produces is not reliable",
        ],
      },
      {
        title: "Empathy Is Not a Mirror. It Is Feeling What Others Feel",
        subtitle: "Most people think empathy means understanding someone's situation. It does not. It means actually feeling their pain, their joy, their fear. And not everyone has the same capacity for it",
        bullets: [
          "There is a common misunderstanding about empathy. People think it is a cognitive exercise: you see someone in pain, you understand they are in pain, you respond appropriately. That is not empathy. That is sympathy, or at best cognitive perspective-taking. Real empathy is feeling the other person's emotion in your own body. Their grief sits in your chest. Their anxiety tightens your stomach. You do not observe their suffering. You share it",
          "This is not a metaphor. There is real neural machinery behind it. When you watch someone get hurt, parts of your own pain matrix activate. Not the parts that register the physical sensation, but the parts that register the emotional distress. Your brain literally runs a partial simulation of what the other person is going through. You feel a shadow of their pain",
          "<strong>Psychopaths have the lowest form of empathy.</strong> This is not a moral judgement. It is a neurological observation. Psychopaths can read facial expressions. They can tell you what emotion someone is displaying. They have the cognitive ability to identify emotions in others. But they do not feel them. The simulation does not run. They see your pain the way you see a weather forecast: informational, not felt. This is why psychopaths can hurt people without hesitation. The brake that stops most of us from causing suffering, which is feeling a version of that suffering ourselves, does not exist for them",
          "<strong>Highly sensitive people have the highest form of empathy.</strong> At the other end of the spectrum are people who feel too much. They walk into a room and absorb the mood. Someone else's sadness becomes their sadness. Someone else's anxiety becomes their anxiety. This is not a choice. It is the empathy system running at maximum gain. Highly sensitive people are often emotionally exhausted because they are constantly processing not just their own feelings but everyone else's too",
          "The people we actually need are not at either extreme. We need people who can feel what others feel but also manage that feeling. The psychopath is useless for cooperation because they cannot be moved by your distress. The overwhelmed empath is useless for leadership because they drown in everyone's feelings and cannot act. The sweet spot is someone who feels your pain genuinely but can still think clearly enough to help. That is managed empathy. It is a skill, not just a trait",
          "This connects to the guilt discussion from Day 4. Guilt is an empathy-adjacent emotion. You feel guilty because you can simulate the harm you caused to someone else. If you could not feel their pain at all, like a psychopath, you would feel no guilt. And if you felt their pain too intensely, like a highly sensitive person, the guilt would be paralysing. The functional middle ground is feeling enough guilt to correct your behaviour without being destroyed by it",
          "I want to go much deeper into this. I want to re-read <strong>'The Selfish Gene' by Richard Dawkins</strong> with this lens. Dawkins argues that genes are the fundamental unit of selection, not organisms. If that is true, then empathy is a gene-level strategy: your genes benefit when you cooperate with others who share them, and empathy is the mechanism that makes cooperation feel good rather than being a cold calculation. The whole point of these emotions, guilt, love, empathy, might be gene-level engineering to make us cooperate. I want to understand whether empathy is a selfish strategy dressed up as selflessness. And more broadly, I want to use Dawkins to tie together everything from this experiment: why emotions exist, why empathy exists, and what all of it says about the point of being alive",
        ],
      },
      {
        title: "What Is Next: Emotions and Machines",
        subtitle: "Two experiments I want to run next. Both connect this emotion research to the thing I actually build: neural networks",
        bullets: [
          "<strong>1. Do LLMs understand emotions?</strong> After seven days of studying how humans feel, I want to flip the question. Do large language models have anything resembling emotional understanding? Not whether they feel emotions, but whether they have learned the structure of emotions from training data. There is a paper from Anthropic I want to read: <a href='https://www.anthropic.com/research/emotion-concepts-function' target='_blank'>'Emotion Concepts and Function'</a>. If LLMs can model emotional states well enough to predict human behaviour, that tells us something interesting about whether emotions are computable or whether they require the biological hardware we spent seven days studying",
          "<strong>2. Can you tune emotions into a neural network?</strong> This is the experiment I am most excited about. If emotions in the brain come down to neurotransmitter levels and activation patterns in specific regions, can we do something analogous in a trained neural network? Take an already-trained LLM and tweak specific neurons or groups of neurons to make it more sad, more empathetic, more cheerful, more anxious. Not through prompting. Through direct weight modification. Like turning up the serotonin dial but for a transformer. If this works, it would be direct evidence that emotional behaviour is an emergent property of network structure, not something that requires biological substrate. And if it does not work, that tells us something too: maybe emotions need the body, the hormones, the hydraulics that Freud talked about. Either way, it should be a fun experiment to run",
        ],
      },
    ],
  },
];
