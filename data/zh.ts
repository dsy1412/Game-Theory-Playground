import { concepts } from "@/data/concepts";
import type { Concept } from "@/lib/types";

const zhCopy: Record<string, Partial<Concept>> = {
  "split-rent-fairly": {
    title: "公平分摊房租",
    shortTitle: "公平分摊房租",
    subtitle: "用密封报价把复杂的房间偏好转化为公平租金。",
    scenario: "三位室友合租一套 1600 美元的公寓，每个房间的吸引力都不一样。",
    interpretation: "分配后每个人获得相同的剩余价值，因此越看重某个房间的人会支付更多。",
    whyItMatters: "公平分配规则能把尴尬谈判变成透明流程。",
    summary: "诚实报价，按最高价值分配房间，再调整租金，让每位室友保留相同剩余。"
  },
  "prisoners-dilemma": {
    title: "囚徒困境",
    shortTitle: "囚徒困境",
    subtitle: "看看为什么个人理性的选择可能让所有人更糟。",
    scenario: "两位室友被怀疑偷吃外卖，必须选择保持沉默或背叛对方。",
    interpretation: "背叛对个人更安全，但双方沉默才是整体更好的结果。",
    whyItMatters: "团队、市场和政治中的信任难题常常都有同样的结构。",
    summary: "如果没有重复互动、规范或信任，自我保护会摧毁共同价值。"
  },
  "nash-equilibrium": {
    title: "纳什均衡",
    shortTitle: "纳什均衡",
    subtitle: "拖动竞争者，观察什么时候没人愿意单独改变。",
    scenario: "两家奶茶店在市中心人流和郊区安静之间选择位置。",
    interpretation: "当任何一方单独移动都不能提高收益时，策略组合就是稳定的。",
    whyItMatters: "均衡解释了为什么一些稳定模式会持续存在，即使它们并不完美。",
    summary: "纳什均衡是策略的停靠点：每个参与者都在回应他人的选择。"
  },
  "vickrey-auction": {
    title: "维克里拍卖",
    shortTitle: "维克里拍卖",
    subtitle: "最高报价者获胜，但只支付第二高价格。",
    scenario: "三位室友用密封报价竞争最好的卧室。",
    interpretation: "你的报价决定能否获胜，但获胜后的支付价格由第二高报价决定。",
    whyItMatters: "二价拍卖解释了广告市场和平台交易中真实报价的激励。",
    summary: "诚实报价很有吸引力，因为压低报价主要会让你错失真正重视的东西。"
  },
  "envy-free-allocation": {
    title: "无嫉妒分配",
    shortTitle: "无嫉妒分配",
    subtitle: "切蛋糕，让每个人都不更喜欢别人的那一份。",
    scenario: "Ava 喜欢奶油，Ben 喜欢巧克力，Chloe 喜欢水果。",
    interpretation: "公平由每个人自己的偏好判断，而不只是看物理大小。",
    whyItMatters: "无嫉妒能帮助分析家务、继承、排班和共享资源的公平性。",
    summary: "如果每个人都认为自己的组合至少不差于别人的组合，分配就是无嫉妒的。"
  },
  "shapley-value": {
    title: "夏普利值",
    shortTitle: "夏普利值",
    subtitle: "平均每位队友在所有加入顺序中的边际贡献。",
    scenario: "三位队友完成价值 1000 美元的项目，但价值取决于谁和谁合作。",
    interpretation: "公平报酬等于一个人在所有可能团队顺序中平均增加的价值。",
    whyItMatters: "夏普利值常用于奖金、成本分摊、归因和协作分析。",
    summary: "与其争论功劳，不如衡量每个人对每个联盟价值的改变。"
  },
  "bertrand-competition": {
    title: "伯特兰竞争",
    shortTitle: "伯特兰竞争",
    subtitle: "调整价格，观察顾客如何流向更便宜的同质商品。",
    scenario: "两家便利店向同一社区销售完全相同的可乐。",
    interpretation: "很小的降价就可能吸走需求，因此价格竞争会压低利润率。",
    whyItMatters: "它解释了价格战、大宗商品市场，以及为什么差异化能保护利润。",
    summary: "当商品完全相同且顾客选择低价时，竞争会把价格推向成本。"
  },
  "tragedy-of-the-commons": {
    title: "公地悲剧",
    shortTitle: "公地悲剧",
    subtitle: "提高个人使用量，观察共享资源如何被消耗。",
    scenario: "三个人共享一个鱼塘，只有适度捕捞时鱼群才会恢复。",
    interpretation: "个人收益归个人，而资源耗损的成本由所有人共同承担。",
    whyItMatters: "气候、交通、公共物品和基础设施都依赖公地激励。",
    summary: "如果没有协调，合理的个人使用也可能叠加成集体崩塌。"
  },
  "ultimatum-game": {
    title: "最后通牒博弈",
    shortTitle: "最后通牒",
    subtitle: "提出分配方案，并比较严格理性与人类公平感。",
    scenario: "玩家 A 分配 100 美元，玩家 B 只能接受或拒绝整笔交易。",
    interpretation: "人们常常拒绝过低报价，因为公平本身也有价值。",
    whyItMatters: "市场、谈判和产品定价都受到公平感影响。",
    summary: "技术上有收益的报价，如果让对方感到不被尊重，也可能失败。"
  },
  "matching-market": {
    title: "匹配市场",
    shortTitle: "匹配市场",
    subtitle: "逐步运行延迟接受算法，观察稳定匹配如何出现。",
    scenario: "学生申请学校，双方都对另一方有不同排序。",
    interpretation: "稳定匹配排除了那些想一起离开当前安排的配对。",
    whyItMatters: "匹配算法帮助分配医生、学生、器官交换和工作岗位。",
    summary: "Gale-Shapley 算法把偏好排序转化为没有双方共同反悔理由的匹配。"
  }
};

export const zhConcepts: Concept[] = concepts.map((concept) => ({
  ...concept,
  ...zhCopy[concept.slug]
}));

export const zhGlossary = [
  ["收益", "参与者从某个结果中得到的价值。"],
  ["策略", "参与者的完整行动计划。"],
  ["占优策略", "无论别人怎么做都最优的策略。"],
  ["均衡", "所有人都在最好回应时形成的稳定状态。"],
  ["剩余", "获得的价值减去支付的价格或成本。"],
  ["分配", "把物品、房间、任务或资源分给不同人。"],
  ["联盟", "一起合作的一组参与者。"],
  ["稳定匹配", "不存在一对双方都更想选择彼此的匹配。"]
];
