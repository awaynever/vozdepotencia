import {
  Accessibility, Activity, AudioLines, Award, BookOpen, Bot, CalendarCheck, Compass, Crown, Flag, Flame, Gauge, Gem,
  Handshake, Heart, HeartHandshake, Lightbulb, Megaphone, MessageCircle, MessageSquareQuote, Mic, Pause, Presentation,
  Scale, Shield, Shuffle, Sparkles, Sprout, Store, Sun, Users, Wallet, Wind, type LucideIcon, type LucideProps,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  Accessibility, Activity, AudioLines, Award, BookOpen, Bot, CalendarCheck, Compass, Crown, Flag, Flame, Gauge, Gem,
  Handshake, Heart, HeartHandshake, Lightbulb, Megaphone, MessageCircle, MessageSquareQuote, Mic, Pause, Presentation,
  Scale, Shield, Shuffle, Sparkles, Sprout, Store, Sun, Users, Wallet, Wind,
}

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = map[name] ?? Sparkles
  return <C aria-hidden="true" {...props} />
}
