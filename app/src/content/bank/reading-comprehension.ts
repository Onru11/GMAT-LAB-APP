// Reading Comprehension bank: 6 original passages, 4 questions each.
// Every question repeats its passage in `passage`, like the Critical reasoning items.

import type { Question, StemPart } from '../questions';

const [A, B, C, D, E] = [0, 1, 2, 3, 4];
const text = (t: string): StemPart[] => [{ t }];

const rc = (passage: string) =>
  (id: string, level: number, rest: Omit<Question, 'id' | 'section' | 'topic' | 'kind' | 'level' | 'passage'>): Question => ({
    id,
    section: 'Verbal',
    topic: 'Reading Comprehension',
    kind: 'Reading comprehension',
    level,
    passage,
    ...rest,
  });

// Reusable methods per question type.
const FAST_PURPOSE = 'Primary purpose: name what each paragraph does in a few words, then pick the choice whose verb and scope cover all of them. Discard choices that match only one paragraph or use a stronger verb than the author does.';
const FAST_DETAIL = 'Detail: find the sentence the stem points to and match the answer to it almost word for word. A choice that is true elsewhere in the passage but answers a different question is the classic trap.';
const FAST_FUNCTION = 'Function: ask why the author put this sentence or paragraph here by reading what comes just before and after. Describe its job (objection, example, qualification) before looking at the choices.';
const FAST_INFERENCE = 'Inference: the right answer must be true given the text, usually one small step from a specific sentence. Eliminate anything stronger, broader or newer than what the passage says.';
const FAST_APPLY = 'Application or strengthen: restate the precise claim or criterion in the passage, then pick the choice that meets every part of it. Choices that are on topic but miss the specific gap are the usual distractors.';
const FAST_TONE = 'Attitude: collect the author’s evaluative words (persuasive, overdrawn, should not be pressed too far). GMAT authors are rarely extreme, so prefer measured, qualified answers whose reason matches the text.';

// ── Science 1: forest fungal networks ─────────────────────────────────────

const fungalNetworks = rc(`Beneath many forests lies a web of fungal threads that link the roots of neighboring trees. These mycorrhizal networks have long been known to trade with individual trees: the fungus supplies water and mineral nutrients, and the tree pays in sugars produced by photosynthesis. Over the past few decades, however, some ecologists have advanced a bolder claim, namely that the networks also move carbon from tree to tree, allowing large, sunlit trees to subsidize shaded seedlings and thereby turning the forest into something like a cooperative.

The evidence for this view is less secure than its popularity suggests. Most experiments that detect carbon passing between trees use labeled isotopes, and the quantities that arrive in a receiving seedling are typically small, often a few percent of its carbon budget. More importantly, these experiments rarely rule out other pathways. Carbon can leak from one root into the soil and be absorbed by another root nearby without ever entering a fungal thread, so finding a label in a seedling does not show that the network carried it there. Even where transfer through fungi is demonstrated, the fungus may simply be moving carbon to wherever it benefits the fungus, not to wherever a seedling needs it.

None of this means the networks are unimportant. Their role in supplying nutrients is well established, and some transfer may matter under particular conditions, such as deep shade. But the image of trees deliberately nourishing their offspring rests on an interpretation that the data, so far, do not compel.`);

// ── Science 2: eye loss in cave fish ──────────────────────────────────────

const caveFish = rc(`Fish that colonize lightless caves tend, over many generations, to lose their eyes. Biologists have long agreed on this pattern but disagreed about its cause. One explanation holds that, once vision becomes useless, mutations that damage eye development are no longer weeded out by natural selection; such mutations simply accumulate by chance until the eye degenerates. A rival explanation holds that eye loss is actively favored, because building and maintaining eyes, and the brain tissue that processes visual signals, consumes energy that is scarce in caves.

The two explanations predict different things. If eye loss were merely the result of accumulated neutral mutations, it should proceed slowly and somewhat erratically, and populations that entered caves at about the same time should differ considerably in how much of the eye they retain. If eye loss saves energy, it should proceed faster and more uniformly, since every reduction would confer an advantage. Some researchers report that in several cave populations eye reduction appears to have occurred faster than neutral accumulation alone would allow, a finding they take to favor the energy explanation.

Yet the explanations need not be exclusive, and neither may be complete. Some genes involved in eye development are thought to influence traits that are useful in darkness, such as the number of taste buds on the head. A mutation that shrinks the eye might therefore spread not because a smaller eye saves energy but because the same mutation enlarges a sense that helps fish find food. On this view, eye loss would be favored by selection, yet only as a by-product.`);

// ── Business 1: loss-leader pricing ───────────────────────────────────────

const lossLeaders = rc(`Retailers have long sold certain goods below cost, betting that shoppers drawn in by the bargain will fill their baskets with more profitable items. The logic of these so-called loss leaders seems straightforward, but its success depends on assumptions that hold less often than managers tend to believe.

The first assumption is that the discounted product brings in customers who would not otherwise have come. If most buyers of a discounted item are regular customers who would have visited anyway, the store merely gives away margin it would have earned. The second assumption is that customers who come for the bargain will buy other goods at normal prices. Some shoppers, however, practice what retailers call cherry-picking: they visit several stores in turn, buying only the discounted items in each. A store whose promotions attract mainly such shoppers can see traffic rise while profits fall. Some economists argue that the spread of online price comparison has made cherry-picking easier and loss leaders correspondingly riskier.

None of this implies that loss leaders should be abandoned. The strategy tends to work best when the discounted item is one that customers buy frequently and together with other goods, when it is bulky enough that carrying it from store to store is inconvenient, and when the store can measure, rather than assume, the purchases that accompany the discounted item. A retailer that tracks what bargain hunters actually buy can discover which promotions pay for themselves and which simply subsidize shoppers' thrift.`);

// ── Economics: inventory buffers ──────────────────────────────────────────

const supplyBuffers = rc(`For several decades, many manufacturers worked to shrink the inventories they held. Under just-in-time production, parts arrive shortly before they are needed, so capital is not tied up in warehouses and defects are discovered quickly rather than hidden in stockpiles. The savings were real, and firms that adopted the approach often became markedly more efficient.

Recent disruptions to shipping have revived interest in the opposite practice of holding buffer stocks. Critics of just-in-time production argue that its efficiency was partly an illusion: by holding few spare parts, firms did not eliminate the cost of uncertainty but shifted it into rare, severe episodes in which a single missing component halted entire production lines. Because such episodes occur infrequently, a firm's accounts can show years of savings before the hidden cost appears all at once.

Yet a wholesale return to large inventories would carry its own risks. Stockpiles are expensive to finance, and they protect only against the specific shortages a firm anticipates; a warehouse full of one component offers no help when a different one fails to arrive. Some analysts therefore favor a targeted approach: identifying the few inputs that are both critical and difficult to source elsewhere, holding buffers of those, and continuing to run lean on the rest. The difficulty is that the inputs most likely to be overlooked are precisely those whose importance becomes clear only when they are missing.`);

// ── Social science: oral history ──────────────────────────────────────────

const oralHistory = rc(`Historians who rely on oral testimony, interviews in which people recall events they lived through, have often been on the defensive. Memory, critics point out, is reconstructive: each time an event is recalled, it is partly rebuilt, colored by what the speaker has since learned and by what the listener seems to want. A written record made at the time, by contrast, is fixed. On this view, oral sources are at best a supplement, useful only where documents are silent.

Defenders of oral history respond that the contrast is overdrawn. Documents, too, were produced by people with purposes: a factory inspector's report reflects what the inspector was expected to find, and official minutes record what a committee chose to put in writing, not everything that was said. Moreover, the very features that make memory unreliable as a record of fact make it valuable as evidence of something else. When a retired dockworker consistently misdates a strike, placing it in the year his father died, the error reveals how he organized the past and what the strike meant to him, information no payroll ledger could supply.

The most persuasive practitioners do not claim that testimony is accurate in every particular. They treat it as they would any source: comparing it against other evidence, asking who produced it and why, and distinguishing what it can establish from what it cannot.`);

// ── Humanities: serialized fiction ────────────────────────────────────────

const serialFiction = rc(`In the nineteenth century, many novels first reached readers not as books but in installments, published weekly or monthly in magazines or as separate paper parts. Literary scholars once treated this mode of publication as a commercial accident, irrelevant to the works themselves; the novel, in this view, was the finished book, and the installments were merely a way of selling it.

More recent scholarship has argued that serialization shaped the novels in ways a reader of the bound volume can easily miss. Because each installment had to hold a reader's interest until the next appeared, writers tended to end parts at moments of suspense and to introduce memorable minor characters who could be recognized after a gap of weeks. Because installments were written while earlier ones were already in print, authors could not revise opening chapters to fit later developments, which helps explain some loose threads that critics once attributed to carelessness. And because readers wrote to magazines and discussed installments in public, some authors adjusted plots in response, giving the serial novel a degree of collaboration with its audience that the image of the solitary author obscures.

These claims should not be pressed too far. Many novels published in parts were planned in detail before the first installment appeared, and authors differed widely in how much they heeded readers. Still, the recognition that the form of publication left marks on the text has changed what scholars count as part of a novel's history.`);

export const READING_COMPREHENSION: Question[] = [
  // ── fungal networks ──
  fungalNetworks('rc-fungal-networks-1', 1, {
    stem: text('The primary purpose of the passage is to'),
    choices: [
      'describe how mycorrhizal fungi exchange nutrients with individual trees',
      'argue that a popular claim about forest fungal networks goes beyond what the available evidence shows',
      'refute the claim that fungal networks ever move carbon from one tree to another',
      'explain why shaded seedlings depend on large trees for their survival',
      'propose a new experimental method for tracing carbon through forest soils',
    ],
    ans: B,
    steps: [
      'Paragraph 1 introduces the "bolder claim" that networks let big trees subsidize seedlings; paragraph 2 opens "The evidence for this view is less secure than its popularity suggests."',
      'Paragraph 3 ends: the image "rests on an interpretation that the data, so far, do not compel." The passage is a critique of the evidence for a popular view, which is (B).',
    ],
    fast: FAST_PURPOSE,
    alt: '(C) is the tempting trap: it is too extreme. The author says "some transfer may matter under particular conditions," so the claim is not refuted, only shown to be under-supported. (A) covers just the first two sentences.',
  }),
  fungalNetworks('rc-fungal-networks-2', 2, {
    stem: text('According to the passage, finding labeled carbon in a seedling does not show that a fungal network carried it there because'),
    choices: [
      'the amounts of labeled carbon detected are usually a small share of a seedling’s carbon budget',
      'fungi can alter isotope labels before the carbon reaches a seedling',
      'seedlings in deep shade produce almost no carbon of their own',
      'carbon released into the soil by one tree’s roots can be absorbed directly by another tree’s roots',
      'fungi keep most of the carbon they receive from trees',
    ],
    ans: D,
    steps: [
      'The stem paraphrases the end of this sentence: "Carbon can leak from one root into the soil and be absorbed by another root nearby without ever entering a fungal thread, so finding a label in a seedling does not show that the network carried it there."',
      'The "so" links the conclusion to the soil pathway, which is (D).',
    ],
    fast: FAST_DETAIL,
    alt: '(A) is half-right: the passage does say the quantities are small, but that is a separate point. The reason for this particular conclusion is the alternative soil pathway, introduced with "More importantly."',
  }),
  fungalNetworks('rc-fungal-networks-3', 3, {
    stem: text('The sentence beginning "Even where transfer through fungi is demonstrated" serves primarily to'),
    choices: [
      'raise a further objection: even confirmed transfer through a network would not by itself show that the network serves seedlings’ needs',
      'concede that the cooperative view is correct wherever transfer has been demonstrated',
      'explain why the quantities of carbon transferred between trees are typically small',
      'identify a flaw in the isotope-labeling technique used in most experiments',
      'suggest that fungi harm seedlings by diverting carbon away from them',
    ],
    ans: A,
    steps: [
      'The previous sentence attacks the pathway ("does not show that the network carried it there"). This one grants that pathway ("Even where transfer through fungi is demonstrated") and attacks the motive.',
      'It says the fungus may move carbon "to wherever it benefits the fungus, not to wherever a seedling needs it", which undercuts the cooperative interpretation. That is a further objection, (A).',
    ],
    fast: FAST_FUNCTION,
    alt: '(D) describes the job of the sentence before it, not this one. (B) misreads "Even where ... is demonstrated" as a concession of the whole view; it concedes only that transfer happens, not that it is cooperative.',
  }),
  fungalNetworks('rc-fungal-networks-4', 4, {
    stem: text('Which of the following findings, if true, would most directly answer the objection the author introduces with the words "More importantly"?'),
    choices: [
      'Labeled carbon has been detected in seedlings in a wider range of forest types than earlier studies examined.',
      'Mycorrhizal fungi supply nitrogen to seedlings more readily than to mature trees.',
      'Seedlings in deep shade grow more slowly than seedlings in sunlit gaps.',
      'Some fungal species in the networks consume a large share of the sugars that trees provide.',
      'Seedlings whose fungal links to a labeled tree had been cut, but whose roots still shared its soil, received almost none of the label, while linked seedlings received substantial amounts.',
    ],
    ans: E,
    steps: [
      'The objection after "More importantly" is that experiments "rarely rule out other pathways", specifically carbon moving through the soil from root to root.',
      'To answer it, an experiment must remove the fungal link while keeping the soil route open. (E) does exactly that, and the label disappears, so the network rather than the soil carried it.',
    ],
    fast: FAST_APPLY,
    alt: '(A) is tempting because it adds more evidence of transfer, but each of those detections has the same flaw: it cannot tell the soil route from the fungal one. More of the same evidence does not answer a methodological objection.',
  }),

  // ── cave fish ──
  caveFish('rc-cave-fish-1', 2, {
    stem: text('Which of the following best describes the organization of the passage?'),
    choices: [
      'An explanation for a biological pattern is presented and then defended against a single objection.',
      'A pattern is described, and the energy explanation for it is shown to have been confirmed by measurements of how quickly eyes were reduced.',
      'Two explanations for a pattern are presented, a way of distinguishing between them is described, and a possibility that complicates a simple choice between them is raised.',
      'A long-standing disagreement about whether cave fish lose their eyes is described and then resolved.',
      'Several studies of taste buds in cave fish are compared, and their methods are evaluated.',
    ],
    ans: C,
    steps: [
      'Paragraph 1 gives "One explanation" (neutral mutations) and "A rival explanation" (energy). Paragraph 2 opens "The two explanations predict different things" and describes evidence.',
      'Paragraph 3: "the explanations need not be exclusive" and offers a by-product view. That sequence is (C).',
    ],
    fast: FAST_PURPOSE,
    alt: '(B) overstates paragraph 2: "Some researchers report" a finding "they take to favor" the energy view; nothing is confirmed, and paragraph 3 complicates it. (D) is wrong because biologists "have long agreed on this pattern."',
  }),
  caveFish('rc-cave-fish-2', 1, {
    stem: text('According to the passage, the explanation based on accumulated neutral mutations predicts that'),
    choices: [
      'populations that entered caves at about the same time should differ considerably in how much of the eye they retain',
      'eye loss should proceed quickly once fish colonize a cave',
      'every reduction in the eye should give a fish an advantage',
      'mutations that shrink the eye should also enlarge other senses',
      'eye loss should proceed at the same rate in all cave populations',
    ],
    ans: A,
    steps: [
      'Paragraph 2: "If eye loss were merely the result of accumulated neutral mutations, it should proceed slowly and somewhat erratically, and populations that entered caves at about the same time should differ considerably."',
      'That is (A) almost word for word.',
    ],
    fast: FAST_DETAIL,
    alt: '(B), (C) and (E) are the predictions of the rival energy explanation ("faster and more uniformly"), swapped onto the wrong theory. (D) belongs to the paragraph 3 by-product view.',
  }),
  caveFish('rc-cave-fish-3', 3, {
    stem: text('The view described in the third paragraph differs from the energy explanation in that it'),
    choices: [
      'denies that natural selection played any role in eye loss',
      'predicts that eye loss should proceed more slowly than the energy explanation predicts',
      'assumes that maintaining eyes requires little energy',
      'treats taste buds as a more energy-efficient sense than vision',
      'attributes the spread of eye-reducing mutations to an advantage that does not come from having a smaller eye',
    ],
    ans: E,
    steps: [
      'The energy view: a smaller eye is itself an advantage because it saves energy.',
      'Paragraph 3: the mutation might spread "not because a smaller eye saves energy but because the same mutation enlarges a sense that helps fish find food", so eye loss is "favored by selection, yet only as a by-product." The advantage lies elsewhere, which is (E).',
    ],
    fast: FAST_INFERENCE,
    alt: '(A) is the tempting misreading: because the by-product view rejects the energy reason, it can look like it rejects selection. But the passage says eye loss "would be favored by selection." (C) is not assumed; the view simply offers a different route.',
  }),
  caveFish('rc-cave-fish-4', 4, {
    stem: text('Which of the following, if true, would be hardest to reconcile with the neutral-mutation explanation as the passage presents it?'),
    choices: [
      'In surface fish, maintaining the eyes and visual brain tissue accounts for a significant share of daily energy use.',
      'In several cave populations that colonized their caves at about the same time, the eyes have been reduced to nearly the same degree.',
      'Some cave fish populations retain small eyes that no longer function.',
      'Eyeless cave fish have more taste buds on the head than their surface-dwelling relatives.',
      'Fish that live in dim but not completely dark water have eyes of normal size.',
    ],
    ans: B,
    steps: [
      'The passage says the neutral view predicts that populations entering caves at about the same time "should differ considerably in how much of the eye they retain."',
      '(B) reports the opposite, uniform reduction across such populations, which the passage ties to the energy view ("more uniformly"). So (B) conflicts directly with the neutral prediction.',
    ],
    fast: FAST_APPLY,
    alt: '(A) is the trap: it makes the energy explanation more plausible, but the neutral view makes no claim that eyes are cheap, so (A) does not contradict it. Supporting a rival is not the same as conflicting with a view.',
  }),

  // ── loss leaders ──
  lossLeaders('rc-loss-leaders-1', 1, {
    stem: text('The primary purpose of the passage is to'),
    choices: [
      'argue that retailers should stop using loss leaders because online price comparison has made them unprofitable',
      'explain how cherry-picking shoppers decide which stores to visit',
      'trace the history of below-cost pricing in retailing',
      'examine the assumptions behind a common retail pricing strategy and the conditions under which it is likely to succeed',
      'show that loss leaders increase both store traffic and profits in most cases',
    ],
    ans: D,
    steps: [
      'Paragraph 1: success "depends on assumptions that hold less often than managers tend to believe." Paragraph 2 lays out "The first assumption" and "The second assumption."',
      'Paragraph 3: "The strategy tends to work best when..." Assumptions plus conditions for success is (D).',
    ],
    fast: FAST_PURPOSE,
    alt: '(A) is contradicted: "None of this implies that loss leaders should be abandoned." The online point is only what "some economists argue." (B) is one detail of paragraph 2.',
  }),
  lossLeaders('rc-loss-leaders-2', 2, {
    stem: text('According to the passage, shoppers who practice cherry-picking'),
    choices: [
      'are mostly regular customers who would have visited the store anyway',
      'visit several stores in turn and buy only the discounted items in each',
      'tend to buy bulky items that are hard to carry between stores',
      'raise both the traffic and the profits of the stores they visit',
      'rarely make use of online price comparison',
    ],
    ans: B,
    steps: [
      'Paragraph 2 defines the term: "they visit several stores in turn, buying only the discounted items in each."',
      'That is (B).',
    ],
    fast: FAST_DETAIL,
    alt: '(D) is half-right: such shoppers can make "traffic rise while profits fall." (A) describes the problem with the first assumption, a different group of customers.',
  }),
  lossLeaders('rc-loss-leaders-3', 3, {
    stem: text('Assuming the store can track what accompanies each discounted purchase, which of the following would the passage suggest is the most promising choice for a loss leader?'),
    choices: [
      'A high-end espresso machine that most customers buy once every several years',
      'Pocket-sized batteries that shoppers buy often and can easily carry from store to store',
      'Laundry detergent in large, heavy containers that most households buy every week or two along with their groceries',
      'Holiday decorations that sell only during a few weeks each year',
      'A specialty spice that customers usually buy on its own, on a trip made just for it',
    ],
    ans: C,
    steps: [
      'Paragraph 3 lists the conditions: bought "frequently and together with other goods" and "bulky enough that carrying it from store to store is inconvenient." The stem supplies the third condition, measurement.',
      'Only (C) meets both product conditions: frequent, bought with groceries, heavy.',
    ],
    fast: FAST_APPLY,
    alt: '(B) is the half-right trap: frequent purchase fits, but "easily carry from store to store" is exactly what makes cherry-picking easy. A choice must satisfy every condition, not most of them.',
  }),
  lossLeaders('rc-loss-leaders-4', 4, {
    stem: text('A store manager notes that customer visits rose sharply during a loss-leader promotion. The author would most likely say that the manager'),
    choices: [
      'cannot conclude from the rise in visits alone that the promotion was profitable',
      'should conclude that the promotion attracted mainly cherry-picking shoppers',
      'should end the promotion because it is likely to reduce profits',
      'has confirmed that both of the strategy’s key assumptions hold',
      'should raise prices on the goods customers buy along with the discounted item',
    ],
    ans: A,
    steps: [
      'Paragraph 2: a store "can see traffic rise while profits fall." So traffic and profit can move apart.',
      'Paragraph 3 urges stores to "measure, rather than assume, the purchases that accompany the discounted item." Visits alone settle nothing about profit, which is (A).',
    ],
    fast: FAST_INFERENCE,
    alt: '(C) is too extreme: the author does not say a traffic rise signals losses, only that it does not prove gains, and warns against abandoning the strategy. (B) overreaches the same way in the other direction.',
  }),

  // ── supply buffers ──
  supplyBuffers('rc-supply-buffers-1', 2, {
    stem: text('Which of the following best expresses the main point of the passage?'),
    choices: [
      'Just-in-time production never delivered the savings its advocates claimed.',
      'Manufacturers should return to holding large inventories of every component they use.',
      'Shipping disruptions are now the main cause of halted production lines.',
      'A targeted approach to inventories removes the risks of both lean production and stockpiling.',
      'Both minimal and large inventories carry significant costs, and even a selective middle course faces a practical difficulty.',
    ],
    ans: E,
    steps: [
      'Paragraph 2 gives the hidden cost of lean inventories; paragraph 3 says "a wholesale return to large inventories would carry its own risks."',
      'It then offers the targeted approach and ends with "The difficulty is that..." All three moves are captured only by (E).',
    ],
    fast: FAST_PURPOSE,
    alt: '(D) is too extreme: the passage closes by naming a difficulty with the targeted approach, so it does not remove all risks. (A) contradicts "The savings were real."',
  }),
  supplyBuffers('rc-supply-buffers-2', 1, {
    stem: text('According to the passage, one benefit of just-in-time production is that'),
    choices: [
      'it protects firms against rare but severe shortages',
      'it helps firms anticipate which components will become scarce',
      'defects in parts tend to be discovered quickly',
      'it reduces firms’ dependence on shipping',
      'it allows firms to change production plans quickly during disruptions',
    ],
    ans: C,
    steps: [
      'Paragraph 1: parts arrive shortly before use, so "defects are discovered quickly rather than hidden in stockpiles."',
      'That is (C).',
    ],
    fast: FAST_DETAIL,
    alt: '(A) reverses the passage: critics say lean inventories shift risk "into rare, severe episodes." (D) and (E) are never stated.',
  }),
  supplyBuffers('rc-supply-buffers-3', 3, {
    stem: text('The sentence "Because such episodes occur infrequently, a firm’s accounts can show years of savings before the hidden cost appears all at once" functions primarily to'),
    choices: [
      'show that just-in-time production produced no real savings',
      'explain how a firm’s records could make just-in-time production look more advantageous than it is',
      'argue that firms should keep their accounts over longer periods',
      'provide evidence that shipping disruptions have become more frequent',
      'explain why stockpiles are expensive to finance',
    ],
    ans: B,
    steps: [
      'The previous sentence reports the critics’ claim that the efficiency was "partly an illusion" because costs were shifted into rare episodes.',
      'This sentence explains how the illusion arises: years of recorded savings come before the cost appears. That is (B).',
    ],
    fast: FAST_FUNCTION,
    alt: '(A) is too extreme: "partly an illusion" and "The savings were real" rule out "no real savings." (E) belongs to paragraph 3.',
  }),
  supplyBuffers('rc-supply-buffers-4', 4, {
    stem: text('The author suggests that the targeted approach described in the third paragraph is limited chiefly because'),
    choices: [
      'buffer stocks are expensive to finance',
      'it requires firms to run lean on every input they use',
      'suppliers of critical inputs are always located far from the firm',
      'the inputs a firm fails to recognize as critical may be those whose importance becomes apparent only during a shortage',
      'it offers no protection against shortages of the inputs a firm has identified as critical',
    ],
    ans: D,
    steps: [
      'The last sentence names the problem directly: "The difficulty is that the inputs most likely to be overlooked are precisely those whose importance becomes clear only when they are missing."',
      'That is (D).',
    ],
    fast: FAST_INFERENCE,
    alt: '(A) is a distorted detail: financing cost is an argument against "a wholesale return to large inventories," the very problem the targeted approach is meant to shrink. The author’s "difficulty" for the targeted approach is identification. (E) contradicts the approach, which buffers exactly those inputs.',
  }),

  // ── oral history ──
  oralHistory('rc-oral-history-1', 2, {
    stem: text('The primary purpose of the passage is to'),
    choices: [
      'present a criticism of oral testimony as historical evidence and explain why defenders consider it overstated',
      'argue that oral testimony is more reliable than written documents',
      'describe techniques that interviewers use to reduce distortion in testimony',
      'show that written records from the past are generally untrustworthy',
      'trace how historians’ attitudes toward oral testimony have changed over time',
    ],
    ans: A,
    steps: [
      'Paragraph 1 states the critics’ case; paragraph 2 opens "Defenders of oral history respond that the contrast is overdrawn."',
      'Paragraph 3 shows how careful practitioners use testimony. Criticism plus reply is (A).',
    ],
    fast: FAST_PURPOSE,
    alt: '(B) is the tempting overreach: the defenders say the contrast is "overdrawn," not reversed, and practitioners do "not claim that testimony is accurate in every particular." (D) is likewise too extreme.',
  }),
  oralHistory('rc-oral-history-2', 2, {
    stem: text('The example of the retired dockworker serves primarily to'),
    choices: [
      'support the critics’ claim that memory is reconstructive',
      'show that payroll ledgers often misrecord the dates of strikes',
      'suggest that memories tied to personal loss are especially accurate',
      'illustrate how an error in testimony can reveal something a written record could not',
      'show that testimony must be checked against documents before it is used',
    ],
    ans: D,
    steps: [
      'The example follows the claim that memory’s flaws make it "valuable as evidence of something else."',
      'The misdating "reveals how he organized the past and what the strike meant to him, information no payroll ledger could supply." That is (D).',
    ],
    fast: FAST_FUNCTION,
    alt: '(A) is half-right: the example does show memory erring, but the author uses it for the defenders’ point, not the critics’. Function questions ask what the author uses the example to do.',
  }),
  oralHistory('rc-oral-history-3', 3, {
    stem: text('The defenders’ reply in the second paragraph suggests that the critics described in the first paragraph overlooked which of the following?'),
    choices: [
      'Memory is partly rebuilt each time an event is recalled.',
      'Oral sources can be useful where documents are silent.',
      'Documents made at the time of an event can also be shaped by the aims of the people who produced them.',
      'Interviewers can avoid influencing the people they interview.',
      'Payroll ledgers are more accurate than factory inspectors’ reports.',
    ],
    ans: C,
    steps: [
      'The critics treat a written record as "fixed," and hence trustworthy by contrast with memory.',
      'The defenders reply: "Documents, too, were produced by people with purposes," citing the inspector’s report and committee minutes. What the critics missed is (C).',
    ],
    fast: FAST_INFERENCE,
    alt: '(A) and (B) are points the critics themselves make, so they cannot be what the critics overlooked. (D) and (E) are outside the passage.',
  }),
  oralHistory('rc-oral-history-4', 4, {
    stem: text('The author’s attitude toward the "most persuasive practitioners" of oral history is best described as'),
    choices: [
      'enthusiasm for their demonstration that testimony is accurate in most particulars',
      'skepticism about their willingness to rely on testimony at all',
      'indifference, since the author takes no position on how testimony should be used',
      'approval of their decision to use testimony only where documents are silent',
      'approval of their practice of subjecting testimony to the same scrutiny as any other source',
    ],
    ans: E,
    steps: [
      'The word "persuasive" signals approval.',
      'The reason given: "They treat it as they would any source: comparing it against other evidence, asking who produced it and why." That is (E).',
    ],
    fast: FAST_TONE,
    alt: '(A) has the right tone but the wrong reason: these practitioners "do not claim that testimony is accurate in every particular." (D) attributes the critics’ restriction to the practitioners.',
  }),

  // ── serial fiction ──
  serialFiction('rc-serial-fiction-1', 3, {
    stem: text('Which of the following best states the main idea of the passage?'),
    choices: [
      'Nineteenth-century novels published in parts were often written carelessly because of deadlines.',
      'Serial publication left identifiable marks on many nineteenth-century novels, though the extent of its influence varied from work to work.',
      'Readers of serialized novels were, in effect, coauthors of the works they read.',
      'Earlier scholars were right to treat serial publication as irrelevant to the novels themselves.',
      'The bound volume, not the installments, should be regarded as the true form of a nineteenth-century novel.',
    ],
    ans: B,
    steps: [
      'Paragraph 2 argues that "serialization shaped the novels," with three examples.',
      'Paragraph 3 limits this ("should not be pressed too far"; "authors differed widely") but affirms that "the form of publication left marks on the text." Influence with a qualification is (B).',
    ],
    fast: FAST_PURPOSE,
    alt: '(C) is too extreme: the passage claims only "a degree of collaboration," and adds that authors "differed widely in how much they heeded readers." (A) repeats the old view the passage corrects.',
  }),
  serialFiction('rc-serial-fiction-2', 2, {
    stem: text('According to the passage, some loose threads in serialized novels can be explained by the fact that'),
    choices: [
      'authors worked carelessly under the pressure of deadlines',
      'readers wrote to magazines demanding changes to plots',
      'many novels were planned in detail before the first installment appeared',
      'installments had to end at moments of suspense',
      'earlier installments were already in print when later ones were written',
    ],
    ans: E,
    steps: [
      'Paragraph 2: "Because installments were written while earlier ones were already in print, authors could not revise opening chapters to fit later developments, which helps explain some loose threads."',
      'That is (E).',
    ],
    fast: FAST_DETAIL,
    alt: '(A) is the explanation the passage replaces ("critics once attributed to carelessness"). (B) and (D) are other effects of serialization, not tied to loose threads.',
  }),
  serialFiction('rc-serial-fiction-3', 3, {
    stem: text('The third paragraph functions primarily to'),
    choices: [
      'reject the recent scholarship described in the second paragraph',
      'add further examples of how serialization shaped novels',
      'defend the view of the earlier scholars described in the first paragraph',
      'qualify the claims of the second paragraph while maintaining that the insight behind them is significant',
      'shift the discussion to how nineteenth-century authors planned their novels',
    ],
    ans: D,
    steps: [
      'It opens "These claims should not be pressed too far" and gives limits (advance planning, authors differing). That is a qualification.',
      'It closes "Still, the recognition ... has changed what scholars count as part of a novel’s history", an affirmation. Both halves together are (D).',
    ],
    fast: FAST_FUNCTION,
    alt: '(C) is half-right: noting advance planning echoes the older view, but "Still" and the final sentence keep the recent scholarship’s main insight, so the paragraph does not defend the old view.',
  }),
  serialFiction('rc-serial-fiction-4', 4, {
    stem: text('Which of the following, if discovered, would most strongly support the claim that some authors adjusted plots in response to readers?'),
    choices: [
      'Magazines that published serialized novels received large numbers of letters from readers.',
      'Many serialized novels were planned in detail before publication began.',
      'An author’s notebook, written before serialization began, plans a minor character’s death, but the character survives in installments published after magazines printed letters praising that character.',
      'Bound editions of serialized novels sold more copies than the original installments.',
      'Several authors revised the opening chapters of their novels before reissuing them as bound volumes.',
    ],
    ans: C,
    steps: [
      'The claim needs two things: reader response and a plot change that followed it.',
      '(C) supplies both: a documented original plan, reader letters, then a changed plot. The other choices lack one or both parts.',
    ],
    fast: FAST_APPLY,
    alt: '(A) is the trap: it shows readers responded, but not that any author changed a plot because of it. (B) points the other way, toward advance planning.',
  }),
];
