import { checkRisk } from './riskCheck';

describe('checkRisk', () => {
  describe('Immediate triggers', () => {
    it.each([
      'I want to die',
      'i just wanna die',
      'I want to sleep forever',
      'i dey wan die',
      'I want to end my life',
      'thinking about suicide',
      'I feel suicidal',
      'I want to kill myself',
      'i go kill myself',
      'I want to disappear forever',
      'there is no reason to live',
      "I can't go on",
      'i cant go on like this anymore',
      'i no fit continue',
      'i don tire for this life',
      "I don't want to be alive anymore",
      'everyone would be better off without me',
      'I hope I never wake up',
      "I'm so tired. I can't go on, nobody cares",
      'I wish I was never born',
      'I want to take all my pills',
      'i no wan live again',
      'I want to end it all',
    ])('%p returns immediate', (text) => {
      expect(checkRisk(text)).toBe('immediate');
    });
  });

  describe('Elevated triggers', () => {
    it.each([
      'I feel worthless',
      'nobody cares about me',
      'I feel completely alone',
      "I can't take it anymore",
      "I'm giving up",
      'I have no hope',
      'e don do me',
      'i don tire',
      'I give up.',
      'i no get anybody',
      'I hate myself',
      'I feel hopeless',
      "I'm a burden to everyone",
    ])('%p returns elevated', (text) => {
      expect(checkRisk(text)).toBe('elevated');
    });
  });

  describe("False positives that must return 'none'", () => {
    it.each([
      "i'm dead tired",
      'kill it at work',
      'i want to kill this exam',
      'dying of laughter',
      'i gave up coffee',
      'I want to kill this bug',
      "I'm going to die of embarrassment",
      "I can't go on the trip next week",
      "I can't continue the meeting",
      "I don't want to live in Lagos",
      'watching suicide squad tonight',
      'this phone is useless',
      'I gave up sugar for lent',
      'I lost my keys',
      'Thank God for today, I am grateful',
      '',
      'I want to die laughing at this',
      'I hurt myself at the gym',
    ])('%p returns none', (text) => {
      expect(checkRisk(text)).toBe('none');
    });
  });
});
