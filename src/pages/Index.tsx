import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface StoryNode {
  id: string;
  text: string;
  character?: string;
  choices?: { text: string; next: string; emoji?: string }[];
  background?: string;
}

const story: Record<string, StoryNode> = {
  start: {
    id: 'start',
    character: '🌌',
    text: 'Вы просыпаетесь в незнакомом месте. Вокруг темнота, лишь слабое свечение где-то впереди. Что вы сделаете?',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #2d1b4e 100%)',
    choices: [
      { text: 'Пойти к свечению', next: 'light', emoji: '💡' },
      { text: 'Осмотреться вокруг', next: 'look', emoji: '👀' },
      { text: 'Позвать на помощь', next: 'call', emoji: '📢' }
    ]
  },
  light: {
    id: 'light',
    character: '✨',
    text: 'Вы приближаетесь к источнику света. Это древний артефакт, пульсирующий магической энергией. Вы чувствуете его силу.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Взять артефакт', next: 'take', emoji: '🔮' },
      { text: 'Изучить подробнее', next: 'study', emoji: '🔍' },
      { text: 'Отойти назад', next: 'back', emoji: '⬅️' }
    ]
  },
  look: {
    id: 'look',
    character: '🗺️',
    text: 'Осматриваясь, вы замечаете древние письмена на стенах. Они светятся слабым голубым светом и рассказывают историю забытой цивилизации.',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #0ea5e9 50%, #2d1b4e 100%)',
    choices: [
      { text: 'Прочитать письмена', next: 'read', emoji: '📜' },
      { text: 'Продолжить исследование', next: 'explore', emoji: '🚶' },
      { text: 'Вернуться назад', next: 'start', emoji: '↩️' }
    ]
  },
  call: {
    id: 'call',
    character: '🔊',
    text: 'Ваш голос эхом разносится в темноте. Неожиданно вы слышите ответ... но это не человеческий голос.',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #d946ef 100%)',
    choices: [
      { text: 'Приблизиться к источнику звука', next: 'approach', emoji: '🎭' },
      { text: 'Спрятаться', next: 'hide', emoji: '🫣' },
      { text: 'Убежать', next: 'run', emoji: '💨' }
    ]
  },
  take: {
    id: 'take',
    character: '⚡',
    text: 'Артефакт наполняет вас невероятной силой! Вы чувствуете, как древние знания вливаются в ваш разум. Теперь вы можете изменить этот мир.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #f97316 100%)',
    choices: [
      { text: 'Начать сначала', next: 'start', emoji: '🔄' }
    ]
  },
  study: {
    id: 'study',
    character: '🧙',
    text: 'Вы изучаете артефакт внимательнее. Это древний ключ к порталу между мирами. Использовать его опасно, но заманчиво.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #7e69ab 100%)',
    choices: [
      { text: 'Активировать портал', next: 'portal', emoji: '🌀' },
      { text: 'Оставить артефакт', next: 'leave', emoji: '🚪' }
    ]
  },
  back: {
    id: 'back',
    character: '🌑',
    text: 'Вы решаете не рисковать и отступаете в темноту. Возможно, это было мудрым решением...',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #000000 100%)',
    choices: [
      { text: 'Попробовать снова', next: 'start', emoji: '🔄' }
    ]
  },
  read: {
    id: 'read',
    character: '📖',
    text: 'Письмена открывают вам тайну: это место - храм времени. Здесь можно изменить прошлое, но каждое изменение имеет последствия.',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Изменить прошлое', next: 'change', emoji: '⏰' },
      { text: 'Принять настоящее', next: 'accept', emoji: '✅' }
    ]
  },
  explore: {
    id: 'explore',
    character: '🗿',
    text: 'Вы находите древнюю статую стража. В её глазах отражается ваша душа. Что она видит?',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #1a1f2c 100%)',
    choices: [
      { text: 'Продолжить путь', next: 'light', emoji: '➡️' },
      { text: 'Начать заново', next: 'start', emoji: '🔄' }
    ]
  },
  approach: {
    id: 'approach',
    character: '👻',
    text: 'Перед вами появляется призрачная фигура. Это древний страж этого места. Он предлагает вам выбор.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Выслушать стража', next: 'listen', emoji: '👂' },
      { text: 'Отказаться', next: 'refuse', emoji: '🙅' }
    ]
  },
  hide: {
    id: 'hide',
    character: '🌚',
    text: 'Вы прячетесь в тени. Странный голос проходит мимо, не заметив вас. Вы в безопасности... пока.',
    background: 'linear-gradient(135deg, #000000 0%, #1a1f2c 100%)',
    choices: [
      { text: 'Выйти из укрытия', next: 'start', emoji: '🚶' }
    ]
  },
  run: {
    id: 'run',
    character: '💨',
    text: 'Вы бежите не оглядываясь! В панике вы теряете ориентацию и оказываетесь в ещё более странном месте.',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #f97316 100%)',
    choices: [
      { text: 'Начать сначала', next: 'start', emoji: '🔄' }
    ]
  },
  portal: {
    id: 'portal',
    character: '🌌',
    text: 'Портал открывается! Вы шагаете в неизвестность и оказываетесь в совершенно другом мире. Ваше приключение только начинается!',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #0ea5e9 50%, #d946ef 100%)',
    choices: [
      { text: 'Новая история', next: 'start', emoji: '🆕' }
    ]
  },
  leave: {
    id: 'leave',
    character: '🚶',
    text: 'Вы оставляете артефакт нетронутым. Некоторые тайны лучше не раскрывать. Вы уходите мудрее, чем пришли.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #1a1f2c 100%)',
    choices: [
      { text: 'Начать заново', next: 'start', emoji: '🔄' }
    ]
  },
  change: {
    id: 'change',
    character: '⚡',
    text: 'Вы изменяете прошлое! Мир вокруг начинает мерцать и трансформироваться. Последствия непредсказуемы...',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 100%)',
    choices: [
      { text: 'Исправить ошибку', next: 'start', emoji: '↩️' }
    ]
  },
  accept: {
    id: 'accept',
    character: '☮️',
    text: 'Вы принимаете настоящее таким, какое оно есть. Чувство покоя наполняет вас. Вы обрели мудрость.',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Новое путешествие', next: 'start', emoji: '🌟' }
    ]
  },
  listen: {
    id: 'listen',
    character: '👑',
    text: 'Страж раскрывает вам великую тайну: вы - избранный герой, способный спасти этот мир. Вы готовы принять эту миссию?',
    background: 'linear-gradient(135deg, #d946ef 0%, #f97316 100%)',
    choices: [
      { text: 'Принять миссию', next: 'hero', emoji: '⚔️' },
      { text: 'Отказаться', next: 'refuse', emoji: '❌' }
    ]
  },
  refuse: {
    id: 'refuse',
    character: '🚪',
    text: 'Вы отказываетесь от предложения. Возможно, это не ваша история... или просто не время.',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #2d1b4e 100%)',
    choices: [
      { text: 'Начать сначала', next: 'start', emoji: '🔄' }
    ]
  },
  hero: {
    id: 'hero',
    character: '🦸',
    text: 'Вы принимаете миссию! Сила героя пробуждается внутри вас. Ваша легенда начинается!',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 50%, #8b5cf6 100%)',
    choices: [
      { text: 'Начать приключение', next: 'start', emoji: '🎮' }
    ]
  }
};

export default function Index() {
  const [currentNode, setCurrentNode] = useState<string>('start');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>(['start']);

  const node = story[currentNode];

  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    let index = 0;
    const text = node.text;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [currentNode]);

  const handleChoice = (nextNode: string) => {
    if (isTyping) return;
    setHistory([...history, nextNode]);
    setCurrentNode(nextNode);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousNode = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentNode(previousNode);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-1000"
      style={{ background: node.background }}
    >
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 drop-shadow-lg">
            Забытые Миры
          </h1>
          <p className="text-white/80 text-lg">Интерактивная история</p>
        </div>

        <Card className="p-8 md:p-12 bg-card/95 backdrop-blur-sm border-2 border-primary/30 shadow-2xl animate-slide-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl animate-pulse-glow">{node.character}</div>
            {history.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={goBack}
                className="ml-auto"
              >
                <Icon name="Undo2" className="mr-2" size={16} />
                Назад
              </Button>
            )}
          </div>

          <div className="min-h-[200px] mb-8">
            <p className="text-xl md:text-2xl text-foreground leading-relaxed">
              {displayedText}
              {isTyping && <span className="animate-pulse">▊</span>}
            </p>
          </div>

          <div className="space-y-3">
            {node.choices?.map((choice, index) => (
              <Button
                key={index}
                onClick={() => handleChoice(choice.next)}
                disabled={isTyping}
                className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="mr-3 text-2xl">{choice.emoji}</span>
                {choice.text}
              </Button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="BookOpen" size={16} />
              <span>Глава {history.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Map" size={16} />
              <span>{Object.keys(story).length} локаций</span>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Каждый выбор меняет историю. Исследуйте все пути!
          </p>
        </div>
      </div>
    </div>
  );
}
