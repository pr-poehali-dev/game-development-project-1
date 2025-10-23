import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

interface StoryNode {
  id: string;
  text: string;
  speaker: 'affogato' | 'banoffee' | 'narrator';
  choices?: { text: string; next: string; trustChange?: number; emoji?: string }[];
  background?: string;
}

const story: Record<string, StoryNode> = {
  start: {
    id: 'start',
    speaker: 'narrator',
    text: 'Вы очнулись в роскошной, но незнакомой комнате. Руки связаны бархатными лентами. Последнее, что вы помните — встреча с Affogato...',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #1a1f2c 100%)',
    choices: [
      { text: 'Попытаться освободиться', next: 'struggle', trustChange: -5, emoji: '💪' },
      { text: 'Осмотреться вокруг', next: 'look_around', trustChange: 0, emoji: '👁️' },
      { text: 'Позвать Affogato', next: 'call_affogato', trustChange: 5, emoji: '🗣️' }
    ]
  },
  
  struggle: {
    id: 'struggle',
    speaker: 'affogato',
    text: '*Входит в комнату* О, Banoffee, не стоит. Эти ленты созданы специально для тебя. Чем больше сопротивляешься, тем сильнее они стягиваются. Разве ты не понимаешь? Я хочу лишь твоего внимания.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #7e69ab 100%)',
    choices: [
      { text: 'Почему ты так поступаешь?', next: 'why', trustChange: 5, emoji: '❓' },
      { text: 'Отпусти меня немедленно!', next: 'demand_release', trustChange: -10, emoji: '😠' },
      { text: 'Ты сумасшедший псих!', next: 'insult_psycho', trustChange: -20, emoji: '🤬' },
      { text: 'Я здесь по своей воле', next: 'pretend_willing', trustChange: 10, emoji: '😌' }
    ]
  },

  look_around: {
    id: 'look_around',
    speaker: 'narrator',
    text: 'Комната обставлена с изысканным вкусом. Повсюду фиолетовые драпировки, свечи, и... фотографии. Ваши фотографии. Сотни их. Дверь открывается.',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #2d1b4e 100%)',
    choices: [
      { text: 'Притвориться спящим', next: 'pretend_sleep', trustChange: -5, emoji: '😴' },
      { text: 'Встретить взглядом', next: 'meet_gaze', trustChange: 10, emoji: '👀' }
    ]
  },

  call_affogato: {
    id: 'call_affogato',
    speaker: 'affogato',
    text: '*Появляется с улыбкой* Ты звал меня, мой дорогой Banoffee? Я так рад, что ты наконец-то здесь. Со мной. Знаешь, сколько ночей я мечтал об этом моменте?',
    background: 'linear-gradient(135deg, #7e69ab 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Зачем ты меня похитил?', next: 'why', trustChange: 0, emoji: '🤔' },
      { text: 'Я тоже думал о тебе', next: 'mutual_feelings', trustChange: 15, emoji: '💭' },
      { text: 'Отвали от меня, урод', next: 'insult_freak', trustChange: -25, emoji: '🖕' },
      { text: 'Развяжи меня, пожалуйста', next: 'ask_nicely', trustChange: 5, emoji: '🙏' }
    ]
  },

  why: {
    id: 'why',
    speaker: 'affogato',
    text: '*Подходит ближе, глаза горят одержимостью* Потому что ты никогда не замечал меня. Твой холодный взгляд... он ранил меня каждый день. Но я не мог жить без тебя, Banoffee. Каждый вдох, каждое биение сердца — всё только ради тебя. Я стал зависим от тебя, как от наркотика.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #d946ef 100%)',
    choices: [
      { text: 'Это не любовь, это одержимость', next: 'call_obsession', trustChange: -15, emoji: '⚠️' },
      { text: 'Прости, что не замечал тебя', next: 'apologize', trustChange: 15, emoji: '😔' },
      { text: 'Ты жалкий и патетичный', next: 'insult_pathetic', trustChange: -20, emoji: '😒' },
      { text: 'Покажи мне свою любовь', next: 'ask_prove', trustChange: 10, emoji: '💜' }
    ]
  },

  demand_release: {
    id: 'demand_release',
    speaker: 'affogato',
    text: '*Холодно смотрит* Требовать? Ты думаешь, ты в положении требовать? Нет, Banoffee. Сейчас ты будешь слушать. Слушать о том, как я страдал.',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #000000 100%)',
    choices: [
      { text: 'Извини, я погорячился', next: 'apologize', trustChange: 10, emoji: '🙇' },
      { text: 'Я готов слушать', next: 'listen', trustChange: 15, emoji: '👂' },
      { text: 'Мне плевать на твои страдания', next: 'refuse_listen', trustChange: -25, emoji: '🙄' },
      { text: '*Молчать*', next: 'silence', trustChange: -5, emoji: '🤐' }
    ]
  },

  pretend_willing: {
    id: 'pretend_willing',
    speaker: 'affogato',
    text: '*Недоверчиво* Правда? Ты... по своей воле? Нет, нет. Ты лжёшь. Все всегда лгут. Докажи мне, что ты говоришь правду, Banoffee.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #7e69ab 100%)',
    choices: [
      { text: 'Какое доказательство тебе нужно?', next: 'ask_proof', trustChange: 10, emoji: '🤝' },
      { text: 'Развяжи меня, и я докажу', next: 'ask_untie', trustChange: 5, emoji: '🔓' }
    ]
  },

  pretend_sleep: {
    id: 'pretend_sleep',
    speaker: 'affogato',
    text: '*Шёпотом* Я знаю, что ты не спишь, Banoffee. Твоё дыхание выдаёт тебя. Не притворяйся. Со мной тебе не нужно носить маски.',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #2d1b4e 100%)',
    choices: [
      { text: 'Открыть глаза', next: 'meet_gaze', trustChange: 5, emoji: '👁️' },
      { text: 'Продолжать притворяться', next: 'keep_pretending', trustChange: -15, emoji: '😑' }
    ]
  },

  meet_gaze: {
    id: 'meet_gaze',
    speaker: 'affogato',
    text: '*Глаза встречаются* Вот так лучше. Твои глаза... они прекрасны. Знаешь, я каждый день смотрел в них, надеясь увидеть хоть искру интереса ко мне.',
    background: 'linear-gradient(135deg, #7e69ab 0%, #d946ef 100%)',
    choices: [
      { text: 'Твои глаза тоже красивые', next: 'compliment', trustChange: 20, emoji: '✨' },
      { text: 'Отпусти меня, и я буду смотреть на тебя чаще', next: 'promise_attention', trustChange: 10, emoji: '👀' }
    ]
  },

  mutual_feelings: {
    id: 'mutual_feelings',
    speaker: 'affogato',
    text: '*Лицо озаряется, но тут же становится подозрительным* Думал обо мне? Не лги. Я видел, как ты проходил мимо, даже не взглянув. Каждый раз... как удар ножом.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Я скрывал свои чувства', next: 'hide_feelings', trustChange: 15, emoji: '🎭' },
      { text: 'Я думал, ты меня не заметишь', next: 'insecurity', trustChange: 20, emoji: '🥺' }
    ]
  },

  ask_nicely: {
    id: 'ask_nicely',
    speaker: 'affogato',
    text: '*Задумывается* Пожалуйста? Ты никогда не говорил мне "пожалуйста". Это... приятно. Но нет. Ещё слишком рано. Сначала ты должен понять мои чувства.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #7e69ab 100%)',
    choices: [
      { text: 'Расскажи мне о своих чувствах', next: 'listen', trustChange: 20, emoji: '💬' },
      { text: 'Я уже понимаю', next: 'claim_understanding', trustChange: -5, emoji: '🤔' }
    ]
  },

  call_obsession: {
    id: 'call_obsession',
    speaker: 'affogato',
    text: '*Взгляд становится холодным* Одержимость? Ты смеешь называть мои чувства одержимостью?! Ты ничего не понимаешь! Абсолютно ничего!',
    background: 'linear-gradient(135deg, #000000 0%, #d946ef 100%)',
    choices: [
      { text: 'Прости, я не то имел в виду', next: 'apologize_quickly', trustChange: 10, emoji: '🙏' },
      { text: 'Тогда объясни мне', next: 'ask_explain', trustChange: 5, emoji: '💭' }
    ]
  },

  apologize: {
    id: 'apologize',
    speaker: 'affogato',
    text: '*Мягчает* Ты... извиняешься? Передо мной? *Подходит ближе* Может быть, ты действительно начинаешь понимать. Расскажи мне, что ты чувствуешь сейчас.',
    background: 'linear-gradient(135deg, #7e69ab 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Я чувствую сожаление', next: 'feel_regret', trustChange: 15, emoji: '😔' },
      { text: 'Я чувствую... интерес к тебе', next: 'feel_interest', trustChange: 25, emoji: '💜' }
    ]
  },

  ask_prove: {
    id: 'ask_prove',
    speaker: 'affogato',
    text: '*Улыбается* Хочешь увидеть мою любовь? *Достаёт дневник* Каждая страница о тебе. Каждая мысль. Каждое биение сердца. Это реально, Banoffee.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Прочитать дневник', next: 'read_diary', trustChange: 20, emoji: '📖' },
      { text: 'Я тронут', next: 'touched', trustChange: 25, emoji: '🥹' }
    ]
  },

  listen: {
    id: 'listen',
    speaker: 'affogato',
    text: '*Садится рядом* Каждый день я приходил, надеясь на твою улыбку. Но ты смотрел сквозь меня. Словно я был невидим. Это... разрывало меня на части.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Я не знал о твоих чувствах', next: 'didnt_know', trustChange: 20, emoji: '💔' },
      { text: 'Положить руку на его плечо', next: 'comfort_touch', trustChange: 30, emoji: '🤝' }
    ]
  },

  silence: {
    id: 'silence',
    speaker: 'affogato',
    text: '*Долгая пауза* Молчишь? Как обычно. Как всегда. Но сейчас я заставлю тебя говорить со мной. Мы будем здесь столько, сколько потребуется.',
    background: 'linear-gradient(135deg, #000000 0%, #1a1f2c 100%)',
    choices: [
      { text: 'Хорошо, я буду говорить', next: 'agree_talk', trustChange: 10, emoji: '💬' }
    ]
  },

  ask_proof: {
    id: 'ask_proof',
    speaker: 'affogato',
    text: '*Думает* Докажи действием. Скажи, что ты чувствуешь ко мне. Искренне. Без лжи. Я всегда чувствую ложь.',
    background: 'linear-gradient(135deg, #7e69ab 0%, #d946ef 100%)',
    choices: [
      { text: 'Я восхищаюсь твоей страстью', next: 'admire', trustChange: 20, emoji: '🔥' },
      { text: 'Я хочу узнать тебя лучше', next: 'want_know', trustChange: 25, emoji: '🌟' }
    ]
  },

  compliment: {
    id: 'compliment',
    speaker: 'affogato',
    text: '*Щёки краснеют* Ты... ты думаешь, что мои глаза красивые? Banoffee, ты впервые говоришь мне что-то... тёплое. *Голос дрожит*',
    background: 'linear-gradient(135deg, #d946ef 0%, #f97316 100%)',
    choices: [
      { text: 'Я говорю правду', next: 'truth', trustChange: 30, emoji: '💯' },
      { text: 'У тебя много красивого', next: 'more_compliments', trustChange: 35, emoji: '✨' },
      { text: 'Развяжи меня, я хочу прикоснуться', next: 'ask_touch', trustChange: 40, emoji: '🤲' }
    ]
  },

  hide_feelings: {
    id: 'hide_feelings',
    speaker: 'affogato',
    text: '*Глаза расширяются* Скрывал? Почему? Почему ты заставлял меня страдать, если чувствовал то же самое?!',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Я боялся отказа', next: 'fear_rejection', trustChange: 30, emoji: '💔' },
      { text: 'Я не умею выражать чувства', next: 'cant_express', trustChange: 25, emoji: '😶' }
    ]
  },

  insecurity: {
    id: 'insecurity',
    speaker: 'affogato',
    text: '*Удивлённо* Ты думал, что Я... не замечу тебя? Banoffee, ты самый яркий человек, которого я встречал. Как я мог не заметить?',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Теперь я понимаю твои чувства', next: 'understand', trustChange: 35, emoji: '💡' },
      { text: 'Мы оба ошибались', next: 'both_wrong', trustChange: 40, emoji: '🤝' },
      { text: 'Может, мы начнём заново?', next: 'start_over', trustChange: 45, emoji: '🌅' }
    ]
  },

  read_diary: {
    id: 'read_diary',
    speaker: 'narrator',
    text: 'Каждая страница наполнена деталями: как вы улыбались, что говорили, как двигались. Это одновременно пугает и... трогает. Столько внимания, столько чувств.',
    background: 'linear-gradient(135deg, #7e69ab 0%, #d946ef 100%)',
    choices: [
      { text: 'Affogato, это невероятно', next: 'diary_moved', trustChange: 35, emoji: '📖' },
      { text: 'Ты помнишь больше, чем я сам', next: 'diary_detail', trustChange: 30, emoji: '✍️' }
    ]
  },

  didnt_know: {
    id: 'didnt_know',
    speaker: 'affogato',
    text: '*Голос мягчает* Не знал? А если бы знал... что бы ты сделал, Banoffee? Ответь честно.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Я бы дал тебе шанс', next: 'give_chance', trustChange: 40, emoji: '💫' },
      { text: 'Я бы поговорил с тобой', next: 'would_talk', trustChange: 35, emoji: '💬' },
      { text: 'Я бы... влюбился в тебя', next: 'would_love', trustChange: 50, emoji: '💜' }
    ]
  },

  comfort_touch: {
    id: 'comfort_touch',
    speaker: 'affogato',
    text: '*Замирает от прикосновения* Banoffee... ты... *Слёзы наворачиваются на глаза* Это первый раз, когда ты сам прикоснулся ко мне.',
    background: 'linear-gradient(135deg, #d946ef 0%, #f97316 100%)',
    choices: [
      { text: 'Развяжи меня, я хочу обнять тебя', next: 'want_hug', trustChange: 60, emoji: '🫂' },
      { text: 'Мне жаль, что причинил боль', next: 'sorry_pain', trustChange: 45, emoji: '💔' },
      { text: 'Ты заслуживаешь любви', next: 'deserve_love', trustChange: 50, emoji: '❤️' }
    ]
  },

  fear_rejection: {
    id: 'fear_rejection',
    speaker: 'affogato',
    text: '*Шокирован* Ты боялся? Я... я никогда не подумал бы, что ТЫ можешь бояться. Banoffee, я бы никогда не отказал тебе. Никогда.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Прости за потерянное время', next: 'lost_time', trustChange: 50, emoji: '⏰' },
      { text: 'Мы можем начать сейчас', next: 'start_now', trustChange: 55, emoji: '🌟' },
      { text: 'Развяжи меня, пожалуйста', next: 'final_ask', trustChange: 45, emoji: '🔓' }
    ]
  },

  both_wrong: {
    id: 'both_wrong',
    speaker: 'affogato',
    text: '*Смеётся сквозь слёзы* Да... мы оба идиоты. Два глупца, которые боялись сделать первый шаг. *Медленно тянется к верёвкам*',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #0ea5e9 100%)',
    choices: [
      { text: 'Давай исправим это', next: 'fix_it', trustChange: 60, emoji: '🔧' },
      { text: 'У нас ещё есть время', next: 'have_time', trustChange: 55, emoji: '⏳' }
    ]
  },

  want_hug: {
    id: 'want_hug',
    speaker: 'affogato',
    text: '*Руки дрожат, развязывая ленты* Banoffee... ты правда хочешь обнять меня? Не убежишь? Обещаешь?',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Обещаю', next: 'promise', trustChange: 70, emoji: '🤞' },
      { text: 'Я никуда не пойду', next: 'stay', trustChange: 75, emoji: '🏠' },
      { text: 'Я хочу быть с тобой', next: 'want_be', trustChange: 80, emoji: '💕' }
    ]
  },

  would_love: {
    id: 'would_love',
    speaker: 'affogato',
    text: '*Вскакивает, развязывает ленты* Влюбился бы? Banoffee! Ты... *Обнимает крепко* Я так долго ждал этих слов. Так долго...',
    background: 'linear-gradient(135deg, #d946ef 0%, #f97316 50%, #8b5cf6 100%)',
    choices: [
      { text: 'Обнять в ответ', next: 'ending_good', trustChange: 100, emoji: '🫂' },
      { text: 'Поцеловать', next: 'ending_perfect', trustChange: 100, emoji: '💋' }
    ]
  },

  start_now: {
    id: 'start_now',
    speaker: 'affogato',
    text: '*Развязывает ленты* Да... начнём прямо сейчас. Правильно. Без похищений, без страха. Просто мы двое.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Взять за руку', next: 'ending_hopeful', trustChange: 100, emoji: '🤝' },
      { text: 'Улыбнуться', next: 'ending_sweet', trustChange: 100, emoji: '😊' }
    ]
  },

  promise: {
    id: 'promise',
    speaker: 'narrator',
    text: '*Ленты падают. Вы свободны. Affogato смотрит на вас с надеждой и страхом. Вы медленно открываете объятия...*',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Обнять крепко', next: 'ending_good', trustChange: 100, emoji: '🫂' },
      { text: 'Сбежать', next: 'ending_escape', trustChange: -100, emoji: '🏃' }
    ]
  },

  ending_good: {
    id: 'ending_good',
    speaker: 'narrator',
    text: 'Вы обнимаете Affogato. Он плачет на вашем плече. Возможно, это начало чего-то настоящего. Или просто способ выжить. Только время покажет правду.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #0ea5e9 100%)',
    choices: [
      { text: 'Начать сначала', next: 'start', emoji: '🔄' }
    ]
  },

  ending_perfect: {
    id: 'ending_perfect',
    speaker: 'narrator',
    text: 'Поцелуй. Настоящий или притворный? Affogato верит в него всем сердцем. Он освобождает вас полностью. Вы остаётесь. Может быть, чувства были настоящими с обеих сторон?',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 50%, #8b5cf6 100%)',
    choices: [
      { text: 'Новая история', next: 'start', emoji: '💫' }
    ]
  },

  ending_hopeful: {
    id: 'ending_hopeful',
    speaker: 'narrator',
    text: 'Ваши руки переплетаются. Affogato улыбается — первая искренняя улыбка за всё время. Вы уходите вместе из этой комнаты. Вместе навстречу неизвестности.',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Заново', next: 'start', emoji: '🌅' }
    ]
  },

  ending_sweet: {
    id: 'ending_sweet',
    speaker: 'narrator',
    text: 'Ваша улыбка растапливает последний лёд в сердце Affogato. Он освобождает вас. "Прости", — шепчет он. "Я тоже", — отвечаете вы. Новое начало.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Сначала', next: 'start', emoji: '✨' }
    ]
  },

  ending_escape: {
    id: 'ending_escape',
    speaker: 'narrator',
    text: 'Вы бежите. Крик Affogato за спиной разрывает тишину. "Ты обещал!" Вы свободны. Но этот крик будет преследовать вас всегда.',
    background: 'linear-gradient(135deg, #000000 0%, #1a1f2c 100%)',
    choices: [
      { text: 'Попробовать иначе', next: 'start', emoji: '↩️' }
    ]
  },

  ask_touch: {
    id: 'ask_touch',
    speaker: 'affogato',
    text: '*Дыхание перехватывает* Прикоснуться? К... ко мне? *Дрожащими руками развязывает ленты* Banoffee... если это ложь, это убьёт меня.',
    background: 'linear-gradient(135deg, #d946ef 0%, #f97316 100%)',
    choices: [
      { text: 'Это не ложь', next: 'not_lie', trustChange: 70, emoji: '💯' },
      { text: 'Погладить по волосам', next: 'touch_hair', trustChange: 80, emoji: '🤲' }
    ]
  },

  not_lie: {
    id: 'not_lie',
    speaker: 'affogato',
    text: '*Освобождает полностью* Тогда докажи. Докажи, что твои слова настоящие.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Обнять его', next: 'ending_good', trustChange: 100, emoji: '🫂' },
      { text: 'Поцеловать его руку', next: 'kiss_hand', trustChange: 90, emoji: '💋' }
    ]
  },

  kiss_hand: {
    id: 'kiss_hand',
    speaker: 'affogato',
    text: '*Замирает* Banoffee... *Слёзы радости* Это больше, чем я мог мечтать. Ты... ты действительно чувствуешь?',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Да, чувствую', next: 'ending_perfect', trustChange: 100, emoji: '💜' },
      { text: 'Сбежать сейчас', next: 'ending_escape', trustChange: -100, emoji: '🏃' }
    ]
  },

  touch_hair: {
    id: 'touch_hair',
    speaker: 'affogato',
    text: '*Закрывает глаза от прикосновения* Так нежно... никто никогда... *Полностью развязывает* Я твой, Banoffee. Навсегда.',
    background: 'linear-gradient(135deg, #d946ef 0%, #f97316 100%)',
    choices: [
      { text: 'Остаться с ним', next: 'ending_perfect', trustChange: 100, emoji: '💕' },
      { text: 'Прижаться ближе и поцеловать', next: 'initiate_intimacy', trustChange: 50, emoji: '💋' },
      { text: 'Воспользоваться моментом и сбежать', next: 'ending_escape', trustChange: -100, emoji: '💨' }
    ]
  },

  keep_pretending: {
    id: 'keep_pretending',
    speaker: 'affogato',
    text: '*Голос становится холодным* Ты продолжаешь игнорировать меня даже здесь? Хорошо. Тогда мне придётся подождать дольше.',
    background: 'linear-gradient(135deg, #000000 0%, #1a1f2c 100%)',
    choices: [
      { text: 'Открыть глаза', next: 'meet_gaze', trustChange: -5, emoji: '👁️' }
    ]
  },

  ask_untie: {
    id: 'ask_untie',
    speaker: 'affogato',
    text: '*Качает головой* Ещё рано, Banoffee. Сначала слова, потом действия. Докажи словами.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #7e69ab 100%)',
    choices: [
      { text: 'Я восхищаюсь тобой', next: 'admire', trustChange: 20, emoji: '✨' },
      { text: 'Я хочу узнать тебя', next: 'want_know', trustChange: 25, emoji: '💭' }
    ]
  },

  promise_attention: {
    id: 'promise_attention',
    speaker: 'affogato',
    text: '*Скептически* Обещания? Я слышал так много обещаний... но действия важнее слов.',
    background: 'linear-gradient(135deg, #7e69ab 0%, #d946ef 100%)',
    choices: [
      { text: 'Тогда дай мне шанс показать', next: 'ask_proof', trustChange: 15, emoji: '🤝' }
    ]
  },

  claim_understanding: {
    id: 'claim_understanding',
    speaker: 'affogato',
    text: '*Недоверчиво* Понимаешь? Докажи. Расскажи, что ты понял.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #7e69ab 100%)',
    choices: [
      { text: 'Ты страдал от одиночества', next: 'understand_loneliness', trustChange: 20, emoji: '💔' }
    ]
  },

  apologize_quickly: {
    id: 'apologize_quickly',
    speaker: 'affogato',
    text: '*Дыхание замедляется* Извинение... хорошо. Я слушаю. Объясни, что ты имел в виду.',
    background: 'linear-gradient(135deg, #d946ef 0%, #7e69ab 100%)',
    choices: [
      { text: 'Я имел в виду, что твои чувства сильны', next: 'strong_feelings', trustChange: 20, emoji: '🔥' }
    ]
  },

  ask_explain: {
    id: 'ask_explain',
    speaker: 'affogato',
    text: '*Садится* Хорошо. Я объясню. Любовь — это когда каждая мысль о человеке. Когда его счастье важнее твоего. Когда ты готов на всё...',
    background: 'linear-gradient(135deg, #7e69ab 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Теперь я понимаю', next: 'understand', trustChange: 25, emoji: '💡' }
    ]
  },

  feel_regret: {
    id: 'feel_regret',
    speaker: 'affogato',
    text: '*Удивлён* Сожаление? За что, Banoffee?',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'За то, что не заметил тебя раньше', next: 'regret_notice', trustChange: 30, emoji: '😔' }
    ]
  },

  feel_interest: {
    id: 'feel_interest',
    speaker: 'affogato',
    text: '*Глаза сияют* Интерес? Ко мне? Banoffee... *Подходит ближе* Скажи ещё раз.',
    background: 'linear-gradient(135deg, #d946ef 0%, #f97316 100%)',
    choices: [
      { text: 'Я действительно интересуюсь тобой', next: 'confirm_interest', trustChange: 40, emoji: '💜' }
    ]
  },

  touched: {
    id: 'touched',
    speaker: 'affogato',
    text: '*Прижимает дневник к груди* Тронут? Это... это всё для тебя. Всегда было только о тебе.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Никто никогда не относился ко мне так', next: 'never_treated', trustChange: 35, emoji: '🥺' }
    ]
  },

  agree_talk: {
    id: 'agree_talk',
    speaker: 'affogato',
    text: '*Облегчённо вздыхает* Наконец-то. Тогда скажи — что ты чувствуешь ко мне?',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #7e69ab 100%)',
    choices: [
      { text: 'Я начинаю понимать тебя', next: 'understand', trustChange: 20, emoji: '💭' }
    ]
  },

  admire: {
    id: 'admire',
    speaker: 'affogato',
    text: '*Краснеет* Восхищаешься? Моей страстью? Banoffee... ты заставляешь моё сердце биться быстрее.',
    background: 'linear-gradient(135deg, #d946ef 0%, #f97316 100%)',
    choices: [
      { text: 'Я говорю искренне', next: 'sincere', trustChange: 35, emoji: '💯' }
    ]
  },

  want_know: {
    id: 'want_know',
    speaker: 'affogato',
    text: '*Улыбается* Узнать меня? По-настоящему? Это... всё, чего я хотел. *Начинает развязывать ленты*',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Расскажи о себе', next: 'tell_about', trustChange: 40, emoji: '💬' }
    ]
  },

  truth: {
    id: 'truth',
    speaker: 'affogato',
    text: '*Слёзы наворачиваются* Правду... ты говоришь правду. Я чувствую. *Руки тянутся к лентам*',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Я всегда говорю тебе правду', next: 'always_truth', trustChange: 45, emoji: '💯' }
    ]
  },

  more_compliments: {
    id: 'more_compliments',
    speaker: 'affogato',
    text: '*Не может сдержать улыбку* Много? Что ещё ты... что ещё ты во мне видишь?',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 100%)',
    choices: [
      { text: 'Твою преданность', next: 'devotion', trustChange: 40, emoji: '💝' },
      { text: 'Твою искренность', next: 'sincerity', trustChange: 40, emoji: '✨' }
    ]
  },

  cant_express: {
    id: 'cant_express',
    speaker: 'affogato',
    text: '*Мягко* Не умеешь? Я... я тоже. Мы похожи, Banoffee. Оба не умеем говорить о чувствах.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Научим друг друга', next: 'teach_each', trustChange: 50, emoji: '🤝' }
    ]
  },

  understand: {
    id: 'understand',
    speaker: 'affogato',
    text: '*Обнимает* Понимаешь... наконец-то кто-то понимает. *Развязывает ленты* Спасибо, Banoffee.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Обнять в ответ', next: 'ending_good', trustChange: 100, emoji: '🫂' }
    ]
  },

  start_over: {
    id: 'start_over',
    speaker: 'affogato',
    text: '*Развязывает ленты* Да. Начнём заново. Правильно. Как должно быть. Я... я отпускаю тебя. По-настоящему.',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Но я не хочу уходить', next: 'dont_want_leave', trustChange: 80, emoji: '💜' },
      { text: 'Спасибо', next: 'ending_hopeful', trustChange: 60, emoji: '🙏' }
    ]
  },

  diary_moved: {
    id: 'diary_moved',
    speaker: 'affogato',
    text: '*Сияет* Невероятно? Для меня ты невероятный. Каждый день. Каждый момент.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Развяжи меня, я хочу обнять тебя', next: 'want_hug', trustChange: 50, emoji: '🫂' }
    ]
  },

  diary_detail: {
    id: 'diary_detail',
    speaker: 'affogato',
    text: '*Смеётся* Потому что для меня ты — центр вселенной. Каждая деталь важна.',
    background: 'linear-gradient(135deg, #7e69ab 0%, #d946ef 100%)',
    choices: [
      { text: 'Ты тоже важен для меня', next: 'important_too', trustChange: 45, emoji: '💜' }
    ]
  },

  give_chance: {
    id: 'give_chance',
    speaker: 'affogato',
    text: '*Развязывает ленты* Шанс... ты бы дал мне шанс? *Плачет* Тогда вот он. Наш шанс. Сейчас.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Обнять', next: 'ending_good', trustChange: 100, emoji: '🫂' }
    ]
  },

  would_talk: {
    id: 'would_talk',
    speaker: 'affogato',
    text: '*Улыбается сквозь слёзы* Поговорил бы? Тогда давай поговорим. Сейчас. Обо всём. *Освобождает*',
    background: 'linear-gradient(135deg, #7e69ab 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Взять за руку', next: 'ending_hopeful', trustChange: 100, emoji: '🤝' }
    ]
  },

  sorry_pain: {
    id: 'sorry_pain',
    speaker: 'affogato',
    text: '*Качает головой* Не надо. Боль того стоила. Она привела меня к этому моменту. К твоему прикосновению.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Больше не будет боли', next: 'no_more_pain', trustChange: 60, emoji: '💝' }
    ]
  },

  deserve_love: {
    id: 'deserve_love',
    speaker: 'affogato',
    text: '*Рыдает* Заслуживаю? Ты... ты думаешь, я заслуживаю? *Полностью освобождает* Тогда... тогда возьми меня.',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 100%)',
    choices: [
      { text: 'Обнять крепко', next: 'ending_perfect', trustChange: 100, emoji: '🫂' }
    ]
  },

  lost_time: {
    id: 'lost_time',
    speaker: 'affogato',
    text: '*Развязывает* Прости? Нет, Banoffee. Это я прошу прощения. За всё. *Обнимает*',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Обнять в ответ', next: 'ending_good', trustChange: 100, emoji: '🫂' }
    ]
  },

  final_ask: {
    id: 'final_ask',
    speaker: 'affogato',
    text: '*Развязывает ленты* Да. Да, конечно. Ты свободен. Всегда был. Я просто... хотел, чтобы ты остался.',
    background: 'linear-gradient(135deg, #7e69ab 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Я останусь', next: 'ending_sweet', trustChange: 100, emoji: '💜' },
      { text: 'Сбежать', next: 'ending_escape', trustChange: -100, emoji: '🏃' }
    ]
  },

  fix_it: {
    id: 'fix_it',
    speaker: 'affogato',
    text: '*Полностью освобождает* Исправим. Вместе. С этого момента — только вместе.',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Вместе', next: 'ending_hopeful', trustChange: 100, emoji: '🤝' }
    ]
  },

  have_time: {
    id: 'have_time',
    speaker: 'affogato',
    text: '*Развязывает* Да. У нас есть время. Всё время мира. *Берёт за руку*',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #0ea5e9 100%)',
    choices: [
      { text: 'Переплести пальцы', next: 'ending_sweet', trustChange: 100, emoji: '🤝' }
    ]
  },

  stay: {
    id: 'stay',
    speaker: 'affogato',
    text: '*Освобождает полностью* Не пойдёшь? Правда? *Обнимает* Тогда я тоже никуда.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Обнять крепче', next: 'ending_good', trustChange: 100, emoji: '🫂' }
    ]
  },

  want_be: {
    id: 'want_be',
    speaker: 'affogato',
    text: '*Полностью освобождает, падает на колени* Быть со мной? Это... это всё, о чём я мечтал. *Плачет от счастья*',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 50%, #8b5cf6 100%)',
    choices: [
      { text: 'Поднять и обнять', next: 'ending_perfect', trustChange: 100, emoji: '💕' }
    ]
  },

  understand_loneliness: {
    id: 'understand_loneliness',
    speaker: 'affogato',
    text: '*Кивает* Да... одиночество. Ты понимаешь. Может быть, ты тоже чувствовал?',
    background: 'linear-gradient(135deg, #7e69ab 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Я тоже был одинок', next: 'lonely_too', trustChange: 35, emoji: '💔' }
    ]
  },

  strong_feelings: {
    id: 'strong_feelings',
    speaker: 'affogato',
    text: '*Улыбается* Сильны... да. Слишком сильны. Извини, что они пугают.',
    background: 'linear-gradient(135deg, #7e69ab 0%, #d946ef 100%)',
    choices: [
      { text: 'Они не пугают. Они впечатляют', next: 'impressive', trustChange: 35, emoji: '✨' }
    ]
  },

  regret_notice: {
    id: 'regret_notice',
    speaker: 'affogato',
    text: '*Обнимает* Не жалей. Главное, что сейчас ты здесь. Со мной. *Развязывает*',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Обнять', next: 'ending_good', trustChange: 100, emoji: '🫂' }
    ]
  },

  confirm_interest: {
    id: 'confirm_interest',
    speaker: 'affogato',
    text: '*Развязывает ленты* Действительно? Тогда... тогда у нас есть шанс. Настоящий шанс.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Взять за руку', next: 'ending_hopeful', trustChange: 100, emoji: '🤝' }
    ]
  },

  never_treated: {
    id: 'never_treated',
    speaker: 'affogato',
    text: '*Прижимает к себе дневник* Потому что никто не любил тебя так, как я. И никогда не полюбит.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Возможно, ты прав', next: 'maybe_right', trustChange: 45, emoji: '💜' }
    ]
  },

  sincere: {
    id: 'sincere',
    speaker: 'affogato',
    text: '*Развязывает одну руку* Искренне... я верю. Продолжай. Скажи ещё.',
    background: 'linear-gradient(135deg, #d946ef 0%, #f97316 100%)',
    choices: [
      { text: 'Ты особенный', next: 'special', trustChange: 45, emoji: '⭐' }
    ]
  },

  tell_about: {
    id: 'tell_about',
    speaker: 'affogato',
    text: '*Полностью освобождает* О себе? Хорошо. Давай начнём... с начала. *Садится рядом*',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Слушать внимательно', next: 'ending_hopeful', trustChange: 100, emoji: '👂' }
    ]
  },

  always_truth: {
    id: 'always_truth',
    speaker: 'affogato',
    text: '*Освобождает полностью* Всегда... тогда обещай. Обещай всегда говорить правду.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Обещаю', next: 'ending_sweet', trustChange: 100, emoji: '🤞' }
    ]
  },

  devotion: {
    id: 'devotion',
    speaker: 'affogato',
    text: '*Слёзы* Преданность... ты ценишь мою преданность? *Полностью развязывает*',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 100%)',
    choices: [
      { text: 'Очень ценю', next: 'ending_perfect', trustChange: 100, emoji: '💝' }
    ]
  },

  sincerity: {
    id: 'sincerity',
    speaker: 'affogato',
    text: '*Улыбается* Искренность... да. Я всегда был искренним с тобой. *Освобождает*',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Теперь моя очередь', next: 'ending_good', trustChange: 100, emoji: '💜' }
    ]
  },

  teach_each: {
    id: 'teach_each',
    speaker: 'affogato',
    text: '*Развязывает* Научим... друг друга. Вместе. Это прекрасно. *Берёт за руку*',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Сжать руку', next: 'ending_hopeful', trustChange: 100, emoji: '🤝' }
    ]
  },

  dont_want_leave: {
    id: 'dont_want_leave',
    speaker: 'affogato',
    text: '*Шок* Не хочешь? Banoffee... *Обнимает крепко* Тогда останься. Пожалуйста, останься.',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 50%, #8b5cf6 100%)',
    choices: [
      { text: 'Я останусь', next: 'ending_perfect', trustChange: 100, emoji: '💕' }
    ]
  },

  important_too: {
    id: 'important_too',
    speaker: 'affogato',
    text: '*Не верит* Важен? Для тебя? Я... *Развязывает полностью* Спасибо. Спасибо.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Обнять', next: 'ending_good', trustChange: 100, emoji: '🫂' }
    ]
  },

  no_more_pain: {
    id: 'no_more_pain',
    speaker: 'affogato',
    text: '*Верит* Не будет? Обещаешь? *Развязывает* Тогда... тогда я тоже обещаю.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #0ea5e9 100%)',
    choices: [
      { text: 'Поцеловать в лоб', next: 'ending_perfect', trustChange: 100, emoji: '💋' }
    ]
  },

  lonely_too: {
    id: 'lonely_too',
    speaker: 'affogato',
    text: '*Обнимает* Ты тоже? Тогда... тогда мы больше не будем одиноки. Никогда. *Освобождает*',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Никогда', next: 'ending_good', trustChange: 100, emoji: '🫂' }
    ]
  },

  impressive: {
    id: 'impressive',
    speaker: 'affogato',
    text: '*Краснеет* Впечатляют? Мои чувства... впечатляют тебя? *Развязывает* Banoffee...',
    background: 'linear-gradient(135deg, #d946ef 0%, #f97316 100%)',
    choices: [
      { text: 'Очень', next: 'ending_sweet', trustChange: 100, emoji: '✨' }
    ]
  },

  maybe_right: {
    id: 'maybe_right',
    speaker: 'affogato',
    text: '*Развязывает полностью* Возможно? Нет, Banoffee. Я точно прав. *Обнимает* И я докажу.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Обнять в ответ', next: 'ending_perfect', trustChange: 100, emoji: '💕' }
    ]
  },

  special: {
    id: 'special',
    speaker: 'affogato',
    text: '*Освобождает полностью* Особенный... для тебя я особенный. *Плачет* Это всё, что мне нужно было услышать.',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 50%, #8b5cf6 100%)',
    choices: [
      { text: 'Обнять и утешить', next: 'ending_perfect', trustChange: 100, emoji: '🫂' }
    ]
  },

  promise_behave: {
    id: 'promise_behave',
    speaker: 'affogato',
    text: '*Прижимается* Не будешь? Обещаешь? *Нежно гладит по лицу* Я так люблю тебя, Banoffee. Так сильно, что иногда теряю контроль. Прости.',
    background: 'linear-gradient(135deg, #7e69ab 0%, #d946ef 100%)',
    choices: [
      { text: 'Я понимаю', next: 'start_understanding', trustChange: 20, emoji: '💜' },
      { text: 'Обнять', next: 'comfort_touch', trustChange: 25, emoji: '🫂' }
    ]
  },

  accept_feelings: {
    id: 'accept_feelings',
    speaker: 'affogato',
    text: '*Поднимает голову, глаза полны слёз счастья* Не бороться? Ты... принимаешь мои чувства? *Развязывает ленты дрожащими руками* Это всё, о чём я мечтал...',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Я принимаю', next: 'ending_good', trustChange: 50, emoji: '💝' }
    ]
  },

  suggest_help: {
    id: 'suggest_help',
    speaker: 'affogato',
    text: '*Смеётся горько* Помощь? Терапевты? Они не понимают. НИКТО не понимает того, что я чувствую к тебе! Это не болезнь, это... *Закрывает лицо руками* Может, ты прав. Но я боюсь, что они заберут тебя у меня.',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #7e69ab 100%)',
    choices: [
      { text: 'Я не уйду', next: 'wont_leave', trustChange: 25, emoji: '🤝' },
      { text: 'Им не нужно знать обо мне', next: 'secret_help', trustChange: 15, emoji: '🤫' }
    ]
  },

  become_something: {
    id: 'become_something',
    speaker: 'affogato',
    text: '*Улыбается слабо* Стать чем-то... вместе? *Протягивает руку* Тогда возьми мою руку. И мы станем чем-то прекрасным.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Взять за руку', next: 'ending_hopeful', trustChange: 30, emoji: '🤝' }
    ]
  },

  logical_release: {
    id: 'logical_release',
    speaker: 'affogato',
    text: '*Качает головой* Логика... ты всегда был логичным. Но логика не может объяснить любовь. Я не отпущу тебя. Даже если это иррационально. ОСОБЕННО потому что это иррационально.',
    background: 'linear-gradient(135deg, #000000 0%, #2d1b4e 100%)',
    choices: [
      { text: 'Тогда давай будем иррациональны вместе', next: 'irrational_together', trustChange: 20, emoji: '🌀' },
      { text: 'Это тупик для нас обоих', next: 'deadlock_ending', trustChange: -30, emoji: '🚫' }
    ]
  },

  mutual_fear: {
    id: 'mutual_fear',
    speaker: 'affogato',
    text: '*Обнимает крепче* Оба напуганы... тогда давай бояться вместе. *Развязывает* Я не хочу, чтобы ты боялся меня. Я хочу, чтобы ты был со мной.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Я с тобой', next: 'ending_good', trustChange: 30, emoji: '💜' }
    ]
  },

  dangerous_fear: {
    id: 'dangerous_fear',
    speaker: 'affogato',
    text: '*Отстраняется* Опасен? Мой страх опасен? *Голос становится холодным* Может быть. Но я уже не могу остановиться. Ты — часть меня теперь.',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #8b0000 100%)',
    choices: [
      { text: 'Тогда сделай меня частью себя правильно', next: 'proper_way', trustChange: 25, emoji: '💫' },
      { text: 'Это нездорово', next: 'unhealthy_ending', trustChange: -25, emoji: '⚕️' }
    ]
  },

  start_understanding: {
    id: 'start_understanding',
    speaker: 'affogato',
    text: '*Сияет* Понимаешь? Правда? *Обнимает* Это всё, что мне нужно. Твоё понимание. Твоё присутствие. Ты.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Развяжи меня', next: 'ask_untie_gentle', trustChange: 15, emoji: '🔓' },
      { text: 'Я здесь', next: 'im_here', trustChange: 25, emoji: '💜' }
    ]
  },

  challenge_love: {
    id: 'challenge_love',
    speaker: 'affogato',
    text: '*Отстраняется, обиженно* Не должна? Тогда какой она должна быть? Расскажи мне! Научи меня! Потому что это — единственная любовь, которую я знаю!',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #7e69ab 100%)',
    choices: [
      { text: 'Любовь — это доверие', next: 'love_is_trust', trustChange: 20, emoji: '💝' },
      { text: 'Ты безнадёжен', next: 'hopeless_insult', trustChange: -35, emoji: '😤' }
    ]
  },

  express_unwillingness: {
    id: 'express_unwillingness',
    speaker: 'affogato',
    text: '*Грустно* Не то, чего хочешь... *Долгая пауза* А чего ты хочешь, Banoffee? Скажи мне. Я сделаю всё.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #1a1f2c 100%)',
    choices: [
      { text: 'Я хочу свободы', next: 'want_freedom', trustChange: -20, emoji: '🕊️' },
      { text: 'Я хочу узнать тебя лучше', next: 'want_know_better', trustChange: 30, emoji: '💭' }
    ]
  },

  stockholm_beginning: {
    id: 'stockholm_beginning',
    speaker: 'affogato',
    text: '*Глаза загораются надеждой* Не так плохо? Ты... ты начинаешь видеть? *Садится рядом* Мы можем быть счастливы здесь. Вместе. Только мы.',
    background: 'linear-gradient(135deg, #7e69ab 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Расскажи мне о своих планах', next: 'ask_plans', trustChange: 20, emoji: '📋' },
      { text: 'Мне нужно время подумать', next: 'need_time', trustChange: 10, emoji: '⏰' }
    ]
  },

  wont_leave: {
    id: 'wont_leave',
    speaker: 'affogato',
    text: '*Хватает за руки* Не уйдёшь? Обещаешь? *Плачет* Тогда... тогда я попробую. Ради тебя я попробую стать лучше.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Мы сделаем это вместе', next: 'ending_hopeful', trustChange: 40, emoji: '🤝' }
    ]
  },

  secret_help: {
    id: 'secret_help',
    speaker: 'affogato',
    text: '*Задумывается* Не говорить о тебе... *Кивает медленно* Хорошо. Я... я попробую. Но только если ты останешься рядом.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #7e69ab 100%)',
    choices: [
      { text: 'Я буду рядом', next: 'ending_hopeful', trustChange: 35, emoji: '💜' }
    ]
  },

  irrational_together: {
    id: 'irrational_together',
    speaker: 'affogato',
    text: '*Смеётся* Иррациональны вместе? *Развязывает* Это... это прекрасно. Два безумца против мира.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Против мира', next: 'ending_sweet', trustChange: 35, emoji: '🌍' }
    ]
  },

  deadlock_ending: {
    id: 'deadlock_ending',
    speaker: 'affogato',
    text: '*Тихо* Тупик... да. Может, ты прав. *Сидит молча долгое время* Мы оба застряли здесь. В этой комнате. В этих чувствах. Без выхода. *Экран медленно темнеет* И, возможно, так будет всегда.',
    background: 'linear-gradient(135deg, #000000 0%, #1a1f2c 100%)',
    choices: []
  },

  proper_way: {
    id: 'proper_way',
    speaker: 'affogato',
    text: '*Удивлён* Правильно? Ты... хочешь быть частью меня? *Развязывает, обнимает нежно* Тогда давай сделаем это правильно. Без боли. Только любовь.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Только любовь', next: 'ending_good', trustChange: 40, emoji: '💕' }
    ]
  },

  unhealthy_ending: {
    id: 'unhealthy_ending',
    speaker: 'affogato',
    text: '*Смеётся истерично* Нездорово? Конечно нездорово! Но это всё, что у меня есть! *Уходит из комнаты* Время идёт. Дни превращаются в недели. Affogato становится всё более отстранённым и непредсказуемым. Вы понимаете — это не закончится хорошо.',
    background: 'linear-gradient(135deg, #000000 0%, #1a1f2c 100%)',
    choices: []
  },

  ask_untie_gentle: {
    id: 'ask_untie_gentle',
    speaker: 'affogato',
    text: '*Развязывает* Конечно. Тебе не нужны эти ленты больше. Я знаю, ты не уйдёшь. *Улыбается*',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Обнять', next: 'ending_good', trustChange: 30, emoji: '🫂' }
    ]
  },

  im_here: {
    id: 'im_here',
    speaker: 'affogato',
    text: '*Развязывает, прижимается* Здесь... со мной. *Плачет от счастья* Это всё, о чём я мечтал.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Всегда', next: 'ending_perfect', trustChange: 50, emoji: '💕' }
    ]
  },

  love_is_trust: {
    id: 'love_is_trust',
    speaker: 'affogato',
    text: '*Задумывается глубоко* Доверие... *Медленно развязывает* Хорошо. Я доверю тебе. И ты... доверишь мне?',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #0ea5e9 100%)',
    choices: [
      { text: 'Да', next: 'ending_hopeful', trustChange: 40, emoji: '🤝' }
    ]
  },

  hopeless_insult: {
    id: 'hopeless_insult',
    speaker: 'affogato',
    text: '*Замирает, лицо бледнеет* Безнадёжен? Я... безнадёжен? *Голос ломается* Тогда... тогда нет смысла пытаться. *Уходит, запирает дверь* Годы проходят в изоляции. Вы больше никогда не видите дневного света.',
    background: 'linear-gradient(135deg, #000000 0%, #000000 100%)',
    choices: []
  },

  want_freedom: {
    id: 'want_freedom',
    speaker: 'affogato',
    text: '*Холодеет* Свободы... от меня? *Встаёт* Понятно. Тогда ты получишь свободу. *Выходит* Но не ту, о которой мечтал. *Дверь закрывается навсегда*',
    background: 'linear-gradient(135deg, #000000 0%, #1a1f2c 100%)',
    choices: []
  },

  want_know_better: {
    id: 'want_know_better',
    speaker: 'affogato',
    text: '*Лицо озаряется* Узнать меня? Лучше? *Развязывает* О Banoffee... я расскажу тебе всё. Каждую мысль, каждое чувство.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Расскажи', next: 'ending_hopeful', trustChange: 35, emoji: '💬' }
    ]
  },

  ask_plans: {
    id: 'ask_plans',
    speaker: 'affogato',
    text: '*Воодушевлённо* Планы? У меня столько планов! Мы будем вместе, всегда. Я позабочусь о тебе. Ты никогда не захочешь уйти.',
    background: 'linear-gradient(135deg, #7e69ab 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Звучит... интересно', next: 'stockholm_progress', trustChange: 20, emoji: '🤔' },
      { text: 'Это звучит как тюрьма', next: 'prison_comment', trustChange: -25, emoji: '⛓️' }
    ]
  },

  need_time: {
    id: 'need_time',
    speaker: 'affogato',
    text: '*Кивает* Время... конечно. У нас есть всё время мира. *Гладит по голове* Думай сколько нужно.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #7e69ab 100%)',
    choices: [
      { text: '*Время проходит*', next: 'time_passes', trustChange: 10, emoji: '⏳' }
    ]
  },

  stockholm_progress: {
    id: 'stockholm_progress',
    speaker: 'affogato',
    text: '*Улыбается* Интересно? Да! *Развязывает наполовину* Видишь? Ты начинаешь понимать. Мы будем счастливы.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Может быть...', next: 'stockholm_ending', trustChange: 30, emoji: '🌀' }
    ]
  },

  prison_comment: {
    id: 'prison_comment',
    speaker: 'affogato',
    text: '*Сердито* Тюрьма?! Это РАЙ! Для нас обоих! *Затягивает ленты туже* Ты ещё не понимаешь, но поймёшь. Со временем все понимают.',
    background: 'linear-gradient(135deg, #8b0000 0%, #000000 100%)',
    choices: [
      { text: 'Извини', next: 'backtrack', trustChange: 5, emoji: '😰' },
      { text: 'Никогда не пойму', next: 'defiant_bad_ending', trustChange: -40, emoji: '🚫' }
    ]
  },

  time_passes: {
    id: 'time_passes',
    speaker: 'narrator',
    text: 'Дни превращаются в недели. Affogato заботлив, но контролирует каждый шаг. Вы начинаете забывать, каково это — быть свободным. Это ваша новая реальность.',
    background: 'linear-gradient(135deg, #1a1f2c 0%, #2d1b4e 100%)',
    choices: [
      { text: 'Принять', next: 'stockholm_ending', trustChange: 25, emoji: '😶' },
      { text: 'Попытаться сбежать', next: 'escape_attempt_late', trustChange: -20, emoji: '🏃' }
    ]
  },

  stockholm_ending: {
    id: 'stockholm_ending',
    speaker: 'affogato',
    text: '*Обнимает* Видишь? Я же говорил. Мы созданы друг для друга. *Вы больше не помните, почему хотели уйти. Может, это и есть счастье?*',
    background: 'linear-gradient(135deg, #7e69ab 0%, #8b5cf6 100%)',
    choices: []
  },

  escape_attempt_late: {
    id: 'escape_attempt_late',
    speaker: 'affogato',
    text: '*Ловит вас* Нет-нет-нет! После всего! После того как я так старался! *Безумные глаза* Если ты не можешь остаться добровольно... *Достаёт шприц* ...то останешься по-другому.',
    background: 'linear-gradient(135deg, #000000 0%, #8b0000 100%)',
    choices: []
  },

  initiate_intimacy: {
    id: 'initiate_intimacy',
    speaker: 'affogato',
    text: '*Замирает от поцелуя, глаза широко распахнуты* Ты... ты целуешь меня? *Трогает губы дрожащими пальцами* Banoffee... это правда? Ты правда... чувствуешь то же самое?',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 50%, #8b5cf6 100%)',
    choices: [
      { text: 'Я влюблён в тебя, Affogato', next: 'confess_love', trustChange: 50, emoji: '💗' },
      { text: 'Хочу показать тебе настоящую близость', next: 'suggest_intimacy', trustChange: 40, emoji: '🔥' }
    ]
  },

  confess_love: {
    id: 'confess_love',
    speaker: 'affogato',
    text: '*Слёзы текут по щекам* Влюблён... ты влюблён в меня? *Обнимает крепко, дрожит* Я так долго ждал этих слов. Так долго мечтал... *Целует нежно* Я тоже люблю тебя. Больше жизни.',
    background: 'linear-gradient(135deg, #d946ef 0%, #f97316 100%)',
    choices: [
      { text: 'Поцеловать глубже', next: 'deepen_kiss', trustChange: 30, emoji: '💋' },
      { text: 'Прошептать: "Покажи мне свою любовь"', next: 'ask_show_love', trustChange: 35, emoji: '🌹' }
    ]
  },

  suggest_intimacy: {
    id: 'suggest_intimacy',
    speaker: 'affogato',
    text: '*Краснеет* Близость? Ты хочешь... *Задыхается* Banoffee, я... я мечтал об этом каждую ночь, но боялся надеяться. *Гладит по лицу* Ты уверен?',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Я хочу быть твоим. Полностью.', next: 'surrender_fully', trustChange: 45, emoji: '💕' },
      { text: 'Позволь мне прикоснуться к тебе', next: 'touch_affogato', trustChange: 40, emoji: '✨' }
    ]
  },

  deepen_kiss: {
    id: 'deepen_kiss',
    speaker: 'affogato',
    text: '*Отвечает на поцелуй страстно, руки скользят по телу* Banoffee... *Между поцелуями* Я так хочу тебя... *Уводит в спальню* Позволь мне показать, как сильно я люблю тебя.',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 100%)',
    choices: [
      { text: 'Пойти с ним', next: 'intimate_scene', trustChange: 50, emoji: '🌙' }
    ]
  },

  ask_show_love: {
    id: 'ask_show_love',
    speaker: 'affogato',
    text: '*Дыхание учащается* Показать? *Берёт за руку, целует пальцы один за другим* Я покажу тебе каждую грань моей любви. *Глаза горят страстью* Каждое прикосновение, каждый поцелуй, каждый вздох — всё для тебя.',
    background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    choices: [
      { text: 'Я готов', next: 'intimate_scene', trustChange: 50, emoji: '💫' }
    ]
  },

  surrender_fully: {
    id: 'surrender_fully',
    speaker: 'affogato',
    text: '*Голос дрожит от эмоций* Моим... полностью моим? *Обнимает, целует шею* О Banoffee, я буду так нежен с тобой. Так заботлив. *Прижимается* Ты — моё сокровище. Моё всё.',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 100%)',
    choices: [
      { text: 'Веди меня', next: 'intimate_scene', trustChange: 50, emoji: '🔥' }
    ]
  },

  touch_affogato: {
    id: 'touch_affogato',
    speaker: 'affogato',
    text: '*Позволяет прикоснуться, закрывает глаза* Да... *Тихий стон* Твои руки... это всё, о чём я мечтал. *Открывает глаза, полные страсти* Моя очередь прикасаться к тебе.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Позволить', next: 'intimate_scene', trustChange: 50, emoji: '💕' }
    ]
  },

  intimate_scene: {
    id: 'intimate_scene',
    speaker: 'narrator',
    text: 'Часы проходят в страстных объятиях. Affogato нежен и внимателен, каждое прикосновение наполнено обожанием. Между поцелуями он шепчет признания. В этой близости нет одержимости — только чистая, настоящая любовь.',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #7e69ab 50%, #d946ef 100%)',
    choices: [
      { text: '*После*', next: 'after_intimacy', trustChange: 30, emoji: '🌅' }
    ]
  },

  after_intimacy: {
    id: 'after_intimacy',
    speaker: 'affogato',
    text: '*Лежит рядом, обнимает* Я никогда не был так счастлив. *Целует в лоб* Banoffee... останься со мной. Не как пленник, а как мой возлюбленный. Мой партнёр. Моя вторая половина.',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    choices: [
      { text: 'Я останусь. Навсегда.', next: 'ending_passionate_love', trustChange: 50, emoji: '💑' },
      { text: 'Давай начнём всё сначала. Правильно.', next: 'ending_new_beginning', trustChange: 40, emoji: '🌟' }
    ]
  },

  ending_passionate_love: {
    id: 'ending_passionate_love',
    speaker: 'affogato',
    text: '*Плачет от счастья* Навсегда... *Целует страстно* Я буду любить тебя каждый день до конца времён. Ты — смысл моей жизни, Banoffee. Мой свет. Моя душа. *Прижимается* И теперь мы вместе. Навсегда. [КОНЦОВКА: Страстная любовь — вы нашли любовь в одержимости]',
    background: 'linear-gradient(135deg, #f97316 0%, #d946ef 50%, #8b5cf6 100%)',
    choices: []
  },

  ending_new_beginning: {
    id: 'ending_new_beginning',
    speaker: 'affogato',
    text: '*Кивает* Сначала... правильно. *Улыбается искренне* Без пут, без страха. Только мы двое, строящие отношения на доверии и любви. *Берёт за руку* Я готов учиться любить тебя правильно, Banoffee. Ради нас. [КОНЦОВКА: Новое начало — любовь рождается из понимания]',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #d946ef 100%)',
    choices: []
  }
};

export default function Index() {
  const [currentNode, setCurrentNode] = useState<string>('start');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>(['start']);
  const [trustLevel, setTrustLevel] = useState<number>(0);

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
    }, 25);

    return () => clearInterval(timer);
  }, [currentNode]);

  const handleChoice = (nextNode: string, trustChange: number = 0) => {
    if (isTyping) return;
    setHistory([...history, nextNode]);
    setCurrentNode(nextNode);
    setTrustLevel(Math.max(0, Math.min(100, trustLevel + trustChange)));
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

  const getSpeakerName = () => {
    switch(node.speaker) {
      case 'affogato': return 'Affogato';
      case 'banoffee': return 'Banoffee';
      default: return '';
    }
  };

  const getTrustColor = () => {
    if (trustLevel >= 70) return 'bg-green-500';
    if (trustLevel >= 40) return 'bg-yellow-500';
    if (trustLevel >= 10) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrustLabel = () => {
    if (trustLevel >= 80) return 'Глубокое доверие';
    if (trustLevel >= 60) return 'Доверяет';
    if (trustLevel >= 40) return 'Осторожен';
    if (trustLevel >= 20) return 'Подозрителен';
    return 'Не доверяет';
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-1000"
      style={{ background: node.background }}
    >
      <div className="max-w-4xl w-full">
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            Пленник Чувств
          </h1>
          <p className="text-white/80 text-sm md:text-base">Психологическая новелла</p>
        </div>

        <div className="mb-4 bg-card/80 backdrop-blur-sm p-4 rounded-lg border border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Доверие Affogato</span>
            <span className="text-sm font-bold text-foreground">{getTrustLabel()}</span>
          </div>
          <div className="relative">
            <Progress value={trustLevel} className="h-3" />
            <div className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${getTrustColor()}`} 
                 style={{ width: `${trustLevel}%` }} />
          </div>
        </div>

        <Card className="p-6 md:p-10 bg-card/95 backdrop-blur-sm border-2 border-primary/30 shadow-2xl animate-slide-in">
          <div className="flex items-start gap-4 mb-6">
            {node.speaker === 'affogato' && (
              <div className="flex-shrink-0">
                <img 
                  src="https://cdn.poehali.dev/files/0240d2dd-05ac-4c90-b2fd-bc39782dae4a.png" 
                  alt="Affogato"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-primary/50 animate-pulse-glow object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              {getSpeakerName() && (
                <div className="text-primary font-bold text-lg mb-2">{getSpeakerName()}</div>
              )}
              <div className="min-h-[150px]">
                <p className="text-lg md:text-xl text-foreground leading-relaxed">
                  {displayedText}
                  {isTyping && <span className="animate-pulse">▊</span>}
                </p>
              </div>
            </div>
            {history.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={goBack}
                className="flex-shrink-0"
              >
                <Icon name="Undo2" size={16} />
              </Button>
            )}
          </div>

          <div className="space-y-3 mt-6">
            {node.choices?.map((choice, index) => (
              <Button
                key={index}
                onClick={() => handleChoice(choice.next, choice.trustChange)}
                disabled={isTyping}
                className={`w-full text-base md:text-lg py-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                  ${choice.trustChange && choice.trustChange > 0 ? 'bg-primary hover:bg-primary/90' : ''}
                  ${choice.trustChange && choice.trustChange < 0 ? 'bg-destructive hover:bg-destructive/90' : ''}
                  ${!choice.trustChange ? 'bg-muted hover:bg-muted/80' : ''}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="mr-2 text-xl">{choice.emoji}</span>
                <span className="flex-1 text-left">{choice.text}</span>
                {choice.trustChange !== undefined && choice.trustChange !== 0 && (
                  <span className="ml-2 text-sm opacity-70">
                    {choice.trustChange > 0 ? `+${choice.trustChange}` : choice.trustChange}
                  </span>
                )}
              </Button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="MessageCircle" size={14} />
              <span>Глава {history.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Heart" size={14} />
              <span>{trustLevel}% доверия</span>
            </div>
          </div>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-white/60 text-xs md:text-sm">
            {trustLevel >= 70 ? '💜 Affogato начинает вам доверять...' : 
             trustLevel >= 40 ? '💭 Будьте осторожны в словах' : 
             '⚠️ Affogato не доверяет вам'}
          </p>
        </div>
      </div>
    </div>
  );
}