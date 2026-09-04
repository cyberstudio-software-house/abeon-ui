import React, { useState } from "react";
import { cn } from "../lib/utils";
import { Input } from "./input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import {
  Search,
  Home,
  FileText,
  Settings,
  User,
  Users,
  ShoppingCart,
  Package,
  FolderTree,
  BarChart3,
  Bell,
  Calendar,
  Mail,
  Heart,
  Star,
  Bookmark,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Globe,
  Building,
  Briefcase,
  CreditCard,
  Truck,
  MessageSquare,
  Phone,
  Camera,
  Image,
  Film,
  Music,
  Headphones,
  Book,
  Newspaper,
  FileSpreadsheet,
  PieChart,
  TrendingUp,
  Target,
  Award,
  Gift,
  Percent,
  DollarSign,
  Wallet,
  Receipt,
  type LucideIcon,
  LayoutDashboard,
  Kanban,
  Boxes,
  Circle,
  Info,
  Check,
  TriangleAlert,
  AlertTriangle,
} from "lucide-react";

interface IconOption {
  name: string;
  icon: LucideIcon;
  keywords: string[];
}

const availableIcons: IconOption[] = [
  // Added 2026-09-04. The set was 46 names and every miss returned `undefined`, which
  // reaches a prop typed `LucideIcon`, renders `<undefined />` and takes the whole tree
  // down with React error #130 (KNOWN_ISSUES §1). These are the names the platform
  // actually passes — the application catalogue's `layout-dashboard` was resolving to a
  // fallback, and the other six are the ones that issue names outright.
  { name: "LayoutDashboard", icon: LayoutDashboard, keywords: ["pulpit", "kokpit", "przegląd"] },
  { name: "Kanban", icon: Kanban, keywords: ["tablica", "zadania", "projekt"] },
  { name: "Boxes", icon: Boxes, keywords: ["moduły", "aplikacje", "zestaw"] },
  { name: "Circle", icon: Circle, keywords: ["kółko", "status", "kropka"] },
  { name: "Info", icon: Info, keywords: ["informacja", "podpowiedź"] },
  { name: "Check", icon: Check, keywords: ["ptaszek", "gotowe", "zaznaczone"] },
  { name: "TriangleAlert", icon: TriangleAlert, keywords: ["ostrzeżenie", "uwaga", "błąd"] },
  { name: "AlertTriangle", icon: AlertTriangle, keywords: ["ostrzeżenie", "uwaga", "błąd"] },
  { name: "Home", icon: Home, keywords: ["dom", "strona", "główna"] },
  { name: "FileText", icon: FileText, keywords: ["plik", "dokument", "tekst"] },
  { name: "Settings", icon: Settings, keywords: ["ustawienia", "konfiguracja"] },
  { name: "User", icon: User, keywords: ["użytkownik", "osoba", "profil"] },
  { name: "Users", icon: Users, keywords: ["użytkownicy", "zespół", "grupa"] },
  { name: "ShoppingCart", icon: ShoppingCart, keywords: ["koszyk", "zakupy", "zamówienie"] },
  { name: "Package", icon: Package, keywords: ["paczka", "produkt", "przesyłka"] },
  { name: "FolderTree", icon: FolderTree, keywords: ["folder", "kategorie", "drzewo"] },
  { name: "BarChart3", icon: BarChart3, keywords: ["wykres", "statystyki", "raport"] },
  { name: "Bell", icon: Bell, keywords: ["powiadomienia", "alert", "dzwonek"] },
  { name: "Calendar", icon: Calendar, keywords: ["kalendarz", "data", "termin"] },
  { name: "Mail", icon: Mail, keywords: ["poczta", "email", "wiadomość"] },
  { name: "Heart", icon: Heart, keywords: ["serce", "ulubione", "polubione"] },
  { name: "Star", icon: Star, keywords: ["gwiazdka", "wyróżnione", "ważne"] },
  { name: "Bookmark", icon: Bookmark, keywords: ["zakładka", "zapisane"] },
  { name: "Tag", icon: Tag, keywords: ["tag", "etykieta", "cena"] },
  { name: "Clock", icon: Clock, keywords: ["zegar", "czas", "historia"] },
  { name: "CheckCircle", icon: CheckCircle, keywords: ["zatwierdzone", "gotowe", "sukces"] },
  { name: "AlertCircle", icon: AlertCircle, keywords: ["alert", "uwaga", "ostrzeżenie"] },
  { name: "Zap", icon: Zap, keywords: ["błyskawica", "szybko", "energia"] },
  { name: "Globe", icon: Globe, keywords: ["świat", "www", "internet"] },
  { name: "Building", icon: Building, keywords: ["budynek", "firma", "biuro"] },
  { name: "Briefcase", icon: Briefcase, keywords: ["walizka", "praca", "biznes"] },
  { name: "CreditCard", icon: CreditCard, keywords: ["karta", "płatność", "finanse"] },
  { name: "Truck", icon: Truck, keywords: ["ciężarówka", "dostawa", "wysyłka"] },
  { name: "MessageSquare", icon: MessageSquare, keywords: ["wiadomość", "czat", "komentarz"] },
  { name: "Phone", icon: Phone, keywords: ["telefon", "kontakt"] },
  { name: "Camera", icon: Camera, keywords: ["aparat", "zdjęcie", "foto"] },
  { name: "Image", icon: Image, keywords: ["obraz", "zdjęcie", "galeria"] },
  { name: "Film", icon: Film, keywords: ["film", "wideo", "media"] },
  { name: "Music", icon: Music, keywords: ["muzyka", "dźwięk", "audio"] },
  { name: "Headphones", icon: Headphones, keywords: ["słuchawki", "audio"] },
  { name: "Book", icon: Book, keywords: ["książka", "słownik", "dokumentacja"] },
  { name: "Newspaper", icon: Newspaper, keywords: ["gazeta", "blog", "artykuł"] },
  { name: "FileSpreadsheet", icon: FileSpreadsheet, keywords: ["arkusz", "excel", "dane"] },
  { name: "PieChart", icon: PieChart, keywords: ["wykres", "analiza", "raport"] },
  { name: "TrendingUp", icon: TrendingUp, keywords: ["trend", "wzrost", "sprzedaż"] },
  { name: "Target", icon: Target, keywords: ["cel", "target", "kampania"] },
  { name: "Award", icon: Award, keywords: ["nagroda", "wyróżnienie", "osiągnięcie"] },
  { name: "Gift", icon: Gift, keywords: ["prezent", "promocja", "bonus"] },
  { name: "Percent", icon: Percent, keywords: ["procent", "rabat", "zniżka"] },
  { name: "DollarSign", icon: DollarSign, keywords: ["dolar", "pieniądze", "cena"] },
  { name: "Wallet", icon: Wallet, keywords: ["portfel", "płatność", "finanse"] },
  { name: "Receipt", icon: Receipt, keywords: ["paragon", "faktura", "rachunek"] },
];

interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
  trigger?: React.ReactNode;
}

export function IconPicker({ value, onChange, trigger }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = availableIcons.filter((icon) => {
    const searchLower = search.toLowerCase();
    return (
      icon.name.toLowerCase().includes(searchLower) ||
      icon.keywords.some((kw) => kw.includes(searchLower))
    );
  });

  const selectedIcon = availableIcons.find((i) => i.name === value);
  const SelectedIconComponent = selectedIcon?.icon;

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            {SelectedIconComponent ? (
              <SelectedIconComponent className="h-4 w-4" />
            ) : (
              <Star className="h-4 w-4" />
            )}
            <span>Wybierz ikonę</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Szukaj ikony..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
        <ScrollArea className="h-[240px]">
          <div className="grid grid-cols-6 gap-1 p-2">
            {filteredIcons.map((iconOption) => {
              const IconComponent = iconOption.icon;
              return (
                <button
                  key={iconOption.name}
                  onClick={() => handleSelect(iconOption.name)}
                  className={cn(
                    "flex items-center justify-center h-9 w-9 rounded-lg hover:bg-accent transition-colors",
                    value === iconOption.name && "bg-primary text-primary-foreground hover:bg-primary"
                  )}
                  title={iconOption.name}
                >
                  <IconComponent className="h-4 w-4" />
                </button>
              );
            })}
          </div>
          {filteredIcons.length === 0 && (
            <p className="text-sm text-foreground-muted text-center py-6">
              Nie znaleziono ikon
            </p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Resolve an icon by its Lucide name, or `undefined` if this library does not carry it.
 *
 * **`availableIcons` is curated on purpose** — it is what the picker renders, and a picker
 * offering Lucide's ~1500 icons is not a picker. Resolving the full set instead would also
 * undo a measured win: excluding it is what took the `abeon-auth-ui` login screen from
 * 264 kB to 11.9 kB gzip, and importing the whole map would pull all of it back.
 *
 * **`undefined` stays in the signature**, deliberately. A silent fallback would hide a
 * misspelled name, and the caller is the only party that knows what a sensible substitute
 * is. What changed on 2026-09-04 is that a miss is now the exception rather than the rule:
 * every name the platform passes is in the set, and a test asserts it.
 *
 * Callers must still handle `undefined`. Feeding it to a prop typed `LucideIcon` renders
 * `<undefined />` and unmounts the tree with React error #130 (KNOWN_ISSUES §1).
 */
export function getIconByName(name: string): LucideIcon | undefined {
  return availableIcons.find((i) => i.name === name)?.icon;
}

export { availableIcons };
