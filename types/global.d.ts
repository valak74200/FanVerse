declare module 'react' {
  export const useState: any
  export const useEffect: any
  export const useRef: any
  export const useMemo: any
  export const useCallback: any
  export const createContext: any
  export const useContext: any
  export const forwardRef: any
  export const Suspense: any
  export const useId: any
  export type ElementRef<T> = any
  export type ComponentPropsWithoutRef<T> = any
  export type ComponentProps<T> = any
  export type ReactNode = any
  export type ReactElement = any
  export type ComponentType<T> = any
  export type ButtonHTMLAttributes<T> = any
  export type HTMLAttributes<T> = any
  export type ThHTMLAttributes<T> = any
  export type TdHTMLAttributes<T> = any
  export type KeyboardEvent<T> = any
  export type CSSProperties = any
  export default any
  
  interface RefObject<T> {
    current: T | null
  }
  
  function useRef<T>(initialValue: T): RefObject<T>
  function useRef<T>(initialValue: T | null): RefObject<T>
  function useRef<T = undefined>(): RefObject<T | undefined>
}

declare module 'react-dom' {
  import * as ReactDOM from 'react-dom'
  export = ReactDOM
  export as namespace ReactDOM
}

declare module 'framer-motion' {
  export const motion: any
  export const AnimatePresence: any
  export const useAnimation: any
  export const useMotionValue: any
  export const useTransform: any
  export const useSpring: any
  export const useScroll: any
  export const useInView: any
}

declare module '@react-three/fiber' {
  export const Canvas: any
  export const useFrame: any
  export const useThree: any
  export const useLoader: any
  export const extend: any
  
  // Surcharger complètement les types pour éviter les conflits
  export namespace JSX {
    interface IntrinsicElements {
      group: any
      mesh: any
      boxGeometry: any
      sphereGeometry: any
      cylinderGeometry: any
      planeGeometry: any
      ringGeometry: any
      circleGeometry: any
      meshStandardMaterial: any
      meshBasicMaterial: any
      spotLight: any
      directionalLight: any
      ambientLight: any
      hemisphereLight: any
      pointLight: any
      positionalAudio: any
      fog: any
      [elemName: string]: any
    }
  }
}

declare module '@react-three/drei' {
  export const OrbitControls: any
  export const Environment: any
  export const PerspectiveCamera: any
  export const Text: any
  export const Html: any
  export const Sky: any
  export const Billboard: any
  export const Sphere: any
  export const Box: any
  export const Plane: any
  export const Cylinder: any
}

declare module 'three' {
  export class Group {
    children: any[]
    position: any
    rotation: any
    scale: any
    userData: any
    add(object: any): void
    remove(object: any): void
  }
  
  export class Mesh {
    position: any
    rotation: any
    scale: any
    material: any
    geometry: any
    userData: any
  }
  
  export class MeshStandardMaterial {
    color: any
    emissive: any
    emissiveIntensity: number
    roughness: number
    metalness: number
    transparent: boolean
    opacity: number
  }
  
  export class Vector2 {
    constructor(x?: number, y?: number)
    x: number
    y: number
  }
  
  export class Vector3 {
    constructor(x?: number, y?: number, z?: number)
    x: number
    y: number
    z: number
  }
  
  export const DoubleSide: any
  export const PI: number
}

// Déclaration globale pour surcharger les types React Three Fiber
declare module '@react-three/fiber/dist/declarations/src/three-types' {
  interface GroupProps {
    position?: any
    rotation?: any
    scale?: any
    [key: string]: any
  }
  
  interface MeshProps {
    position?: any
    rotation?: any
    scale?: any
    [key: string]: any
  }
  
  interface SpotLightProps {
    position?: any
    target?: any
    [key: string]: any
  }
  
  interface DirectionalLightProps {
    position?: any
    [key: string]: any
  }
}

declare module 'lucide-react' {
  export const Users: any
  export const Trophy: any
  export const Heart: any
  export const Zap: any
  export const Gamepad2: any
  export const Stadium: any
  export const MessageCircle: any
  export const Coins: any
  export const Crown: any
  export const Frown: any
  export const Meh: any
  export const Radius: any
  export const Sparkles: any
  export const Volume2: any
  export const Settings: any
  export const UserPlus: any
  export const TrendingUp: any
  export const TrendingDown: any
  export const Target: any
  export const Fire: any
  export const Plus: any
  export const ArrowRight: any
  export const ArrowUpRight: any
  export const ArrowDownLeft: any
  export const Timer: any
  export const Mic: any
  export const MicOff: any
  export const Smile: any
  export const ImageIcon: any
  export const Send: any
  export const Wallet: any
  export const Copy: any
  export const ExternalLink: any
  export const History: any
  export const ChevronDown: any
  export const Shield: any
  export const Star: any
  export const Bell: any
  export const Search: any
  export const User: any
  export const Home: any
  export const ChevronRight: any
  export const ChevronLeft: any
  export const ChevronUp: any
  export const Check: any
  export const Circle: any
  export const ArrowLeft: any
  export const Dot: any
  export const GripVertical: any
  export const PanelLeft: any
  export const Lock: any
  export const Calculator: any
  export const QrCode: any
  export const Minus: any
  export const LogOut: any
  export const ShoppingCart: any
  export const BarChart3: any
  export const Menu: any
  export const X: any
  export const Calendar: any
  export const Award: any
  export const Gift: any
  export const Clock: any
  export const Flame: any
  export const Eye: any
  export const Camera: any
  export const Share2: any
  export const Download: any
  export const MoreVertical: any
  export const MoreHorizontal: any
  export const ArrowUpDown: any
  export const Lock: any
  export const Calculator: any
  export const QrCode: any
  export const Minus: any
  export const LogOut: any
}

declare module 'socket.io-client' {
  export function io(url: string, options?: any): any
}

declare module 'next-themes' {
  export interface ThemeProviderProps {
    children: React.ReactNode
    attribute?: string
    defaultTheme?: string
    enableSystem?: boolean
    disableTransitionOnChange?: boolean
    [key: string]: any
  }
  
  export const ThemeProvider: React.ComponentType<ThemeProviderProps>
  export function useTheme(): {
    theme: string | undefined
    setTheme: (theme: string) => void
    resolvedTheme: string | undefined
    themes: string[]
    systemTheme: string | undefined
  }
}

declare module 'wagmi' {
  export const useAccount: any
  export const useConnect: any
  export const useDisconnect: any
  export const useBalance: any
  export const useContractRead: any
  export const useContractWrite: any
  export const usePrepareContractWrite: any
  export const useWaitForTransaction: any
  export const useEnsName: any
  export const WagmiConfig: any
  export const createConfig: any
  export const configureChains: any
}

declare module 'wagmi/connectors/injected' {
  export class InjectedConnector {
    constructor(options?: any)
  }
}

declare module 'wagmi/chains' {
  export const mainnet: any
  export const polygon: any
  export const optimism: any
  export const arbitrum: any
}

declare module 'wagmi/connectors/metaMask' {
  export class MetaMaskConnector {
    constructor(options?: any)
  }
}

declare module 'wagmi/connectors/coinbaseWallet' {
  export class CoinbaseWalletConnector {
    constructor(options?: any)
  }
}

declare module 'wagmi/connectors/walletConnect' {
  export class WalletConnectConnector {
    constructor(options?: any)
  }
}

declare module 'wagmi/providers/public' {
  export function publicProvider(): any
}

declare module '@radix-ui/react-accordion' {
  export const Root: any
  export const Item: any
  export const Header: any
  export const Trigger: any
  export const Content: any
}

declare module '@/lib/utils' {
  export function cn(...classes: any[]): string
}

// Modules Radix UI
declare module '@radix-ui/react-alert-dialog' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Overlay: any
  export const Content: any
  export const Header: any
  export const Title: any
  export const Description: any
  export const Action: any
  export const Cancel: any
}

declare module '@radix-ui/react-aspect-ratio' {
  export const Root: any
}

declare module '@radix-ui/react-avatar' {
  export const Root: any
  export const Image: any
  export const Fallback: any
}

declare module '@radix-ui/react-checkbox' {
  export const Root: any
  export const Indicator: any
}

declare module '@radix-ui/react-collapsible' {
  export const Root: any
  export const Trigger: any
  export const Content: any
}

declare module '@radix-ui/react-dialog' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Overlay: any
  export const Content: any
  export const Header: any
  export const Title: any
  export const Description: any
  export const Close: any
}

declare module '@radix-ui/react-dropdown-menu' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Item: any
  export const CheckboxItem: any
  export const RadioItem: any
  export const Label: any
  export const Separator: any
  export const Arrow: any
  export const Sub: any
  export const SubTrigger: any
  export const SubContent: any
  export const Group: any
  export const RadioGroup: any
  export const ItemIndicator: any
  export const Shortcut: any
}

declare module '@radix-ui/react-hover-card' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Arrow: any
}

declare module '@radix-ui/react-label' {
  export const Root: any
}

declare module '@radix-ui/react-menubar' {
  export const Root: any
  export const Menu: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Item: any
  export const CheckboxItem: any
  export const RadioItem: any
  export const Label: any
  export const Separator: any
  export const Arrow: any
  export const Sub: any
  export const SubTrigger: any
  export const SubContent: any
  export const Group: any
  export const RadioGroup: any
  export const ItemIndicator: any
  export const Shortcut: any
}

declare module '@radix-ui/react-navigation-menu' {
  export const Root: any
  export const List: any
  export const Item: any
  export const Trigger: any
  export const Content: any
  export const Link: any
  export const Indicator: any
  export const Viewport: any
}

declare module '@radix-ui/react-popover' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Arrow: any
  export const Close: any
  export const Anchor: any
}

declare module '@radix-ui/react-progress' {
  export const Root: any
  export const Indicator: any
}

declare module '@radix-ui/react-radio-group' {
  export const Root: any
  export const Item: any
  export const Indicator: any
}

declare module '@radix-ui/react-scroll-area' {
  export const Root: any
  export const Viewport: any
  export const Scrollbar: any
  export const Thumb: any
  export const Corner: any
}

declare module '@radix-ui/react-select' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Viewport: any
  export const Item: any
  export const ItemText: any
  export const ItemIndicator: any
  export const ScrollUpButton: any
  export const ScrollDownButton: any
  export const Group: any
  export const Label: any
  export const Separator: any
  export const Arrow: any
  export const Value: any
  export const Icon: any
}

declare module '@radix-ui/react-separator' {
  export const Root: any
}

declare module '@radix-ui/react-slider' {
  export const Root: any
  export const Track: any
  export const Range: any
  export const Thumb: any
}

declare module '@radix-ui/react-switch' {
  export const Root: any
  export const Thumb: any
}

declare module '@radix-ui/react-tabs' {
  export const Root: any
  export const List: any
  export const Trigger: any
  export const Content: any
}

declare module '@radix-ui/react-toast' {
  export const Provider: any
  export const Root: any
  export const Title: any
  export const Description: any
  export const Action: any
  export const Close: any
  export const Viewport: any
}

declare module '@radix-ui/react-toggle' {
  export const Root: any
}

declare module '@radix-ui/react-toggle-group' {
  export const Root: any
  export const Item: any
}

declare module '@radix-ui/react-tooltip' {
  export const Provider: any
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Arrow: any
}

declare module '@radix-ui/react-context-menu' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Item: any
  export const CheckboxItem: any
  export const RadioItem: any
  export const Label: any
  export const Separator: any
  export const Arrow: any
  export const Sub: any
  export const SubTrigger: any
  export const SubContent: any
  export const Group: any
  export const RadioGroup: any
  export const ItemIndicator: any
  export const Shortcut: any
}

// Autres modules manquants
declare module 'cmdk' {
  export const Command: any
  export const CommandDialog: any
  export const CommandInput: any
  export const CommandList: any
  export const CommandEmpty: any
  export const CommandGroup: any
  export const CommandItem: any
  export const CommandShortcut: any
  export const CommandSeparator: any
}

declare module 'react-day-picker' {
  export const DayPicker: any
  export type DayPickerProps = any
}

declare module 'embla-carousel-react' {
  export default function useEmblaCarousel(options?: any): any
}

declare module 'recharts' {
  export const ResponsiveContainer: any
  export const LineChart: any
  export const BarChart: any
  export const PieChart: any
  export const AreaChart: any
  export const XAxis: any
  export const YAxis: any
  export const CartesianGrid: any
  export const Tooltip: any
  export const Legend: any
  export const Line: any
  export const Bar: any
  export const Area: any
  export const Pie: any
  export const Cell: any
}

declare module 'react-hook-form' {
  export function useForm(options?: any): any
  export function useFormContext(): any
  export function useController(options?: any): any
  export function useWatch(options?: any): any
  export const Controller: any
  export const FormProvider: any
}

declare module 'input-otp' {
  export const OTPInput: any
  export const SlotProps: any
}

declare module 'react-resizable-panels' {
  export const Panel: any
  export const PanelGroup: any
  export const PanelResizeHandle: any
}

declare module 'sonner' {
  export const Toaster: any
  export const toast: any
}

declare module 'vaul' {
  export const Drawer: any
  export const DrawerTrigger: any
  export const DrawerContent: any
  export const DrawerHeader: any
  export const DrawerTitle: any
  export const DrawerDescription: any
  export const DrawerFooter: any
  export const DrawerClose: any
  export const DrawerOverlay: any
  export const DrawerPortal: any
}

declare module '@radix-ui/react-slot' {
  export const Slot: any
}

declare module 'class-variance-authority' {
  export function cva(...args: any[]): any
  export type VariantProps<T> = any
}

// Modules Radix UI supplémentaires
declare module '@radix-ui/react-dialog' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Overlay: any
  export const Content: any
  export const Header: any
  export const Title: any
  export const Description: any
  export const Close: any
}

declare module '@radix-ui/react-dropdown-menu' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Item: any
  export const CheckboxItem: any
  export const RadioItem: any
  export const Label: any
  export const Separator: any
  export const Arrow: any
  export const ItemIndicator: any
  export const RadioGroup: any
  export const Group: any
  export const Sub: any
  export const SubContent: any
  export const SubTrigger: any
}

declare module '@radix-ui/react-hover-card' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Arrow: any
}

declare module '@radix-ui/react-label' {
  export const Root: any
}

declare module '@radix-ui/react-menubar' {
  export const Root: any
  export const Menu: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Item: any
  export const CheckboxItem: any
  export const RadioItem: any
  export const Label: any
  export const Separator: any
  export const Arrow: any
  export const ItemIndicator: any
  export const RadioGroup: any
  export const Group: any
  export const Sub: any
  export const SubContent: any
  export const SubTrigger: any
}

declare module '@radix-ui/react-navigation-menu' {
  export const Root: any
  export const List: any
  export const Item: any
  export const Trigger: any
  export const Content: any
  export const Link: any
  export const Indicator: any
  export const Viewport: any
}

declare module '@radix-ui/react-popover' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Arrow: any
  export const Close: any
  export const Anchor: any
}

declare module '@radix-ui/react-progress' {
  export const Root: any
  export const Indicator: any
}

declare module '@radix-ui/react-radio-group' {
  export const Root: any
  export const Item: any
  export const Indicator: any
}

declare module '@radix-ui/react-scroll-area' {
  export const Root: any
  export const Viewport: any
  export const Scrollbar: any
  export const Thumb: any
  export const Corner: any
}

declare module '@radix-ui/react-select' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Item: any
  export const ItemText: any
  export const ItemIndicator: any
  export const Label: any
  export const Separator: any
  export const Arrow: any
  export const Value: any
  export const Icon: any
  export const Group: any
  export const ScrollUpButton: any
  export const ScrollDownButton: any
  export const Viewport: any
}

declare module '@radix-ui/react-separator' {
  export const Root: any
}

declare module '@radix-ui/react-slider' {
  export const Root: any
  export const Track: any
  export const Range: any
  export const Thumb: any
}

declare module '@radix-ui/react-switch' {
  export const Root: any
  export const Thumb: any
}

declare module '@radix-ui/react-tabs' {
  export const Root: any
  export const List: any
  export const Trigger: any
  export const Content: any
}

declare module '@radix-ui/react-toast' {
  export const Provider: any
  export const Root: any
  export const Title: any
  export const Description: any
  export const Action: any
  export const Close: any
  export const Viewport: any
}

declare module '@radix-ui/react-toggle' {
  export const Root: any
}

declare module '@radix-ui/react-toggle-group' {
  export const Root: any
  export const Item: any
}

declare module '@radix-ui/react-tooltip' {
  export const Provider: any
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Arrow: any
}

declare module '@radix-ui/react-context-menu' {
  export const Root: any
  export const Trigger: any
  export const Portal: any
  export const Content: any
  export const Item: any
  export const CheckboxItem: any
  export const RadioItem: any
  export const Label: any
  export const Separator: any
  export const Arrow: any
  export const ItemIndicator: any
  export const RadioGroup: any
  export const Group: any
  export const Sub: any
  export const SubContent: any
  export const SubTrigger: any
}

declare module '@radix-ui/react-form' {
  export const Root: any
  export const Field: any
  export const Label: any
  export const Control: any
  export const Message: any
  export const ValidityState: any
  export const Submit: any
}

// Modules externes supplémentaires
declare module 'embla-carousel-react' {
  export default function useEmblaCarousel(options?: any, plugins?: any[]): any
}

declare module 'embla-carousel-autoplay' {
  export default function Autoplay(options?: any): any
}

declare module 'cmdk' {
  export const Command: any
  export const CommandDialog: any
  export const CommandInput: any
  export const CommandList: any
  export const CommandEmpty: any
  export const CommandGroup: any
  export const CommandItem: any
  export const CommandShortcut: any
  export const CommandSeparator: any
}

declare module 'react-hook-form' {
  export function useForm(...args: any[]): any
  export function useFormContext(): any
  export function useController(...args: any[]): any
  export function useFormState(): any
  export function useWatch(...args: any[]): any
  export const Controller: any
  export const FormProvider: any
  export type FieldPath<T> = any
  export type FieldValues = any
  export type Control<T> = any
  export type ControllerProps<T> = any
}

declare module '@hookform/resolvers/zod' {
  export function zodResolver(...args: any[]): any
}

declare module 'zod' {
  export const z: any
  export type ZodType<T> = any
  export type infer<T> = any
}

declare module 'recharts' {
  export const ResponsiveContainer: any
  export const LineChart: any
  export const BarChart: any
  export const AreaChart: any
  export const PieChart: any
  export const RadarChart: any
  export const ScatterChart: any
  export const ComposedChart: any
  export const Line: any
  export const Bar: any
  export const Area: any
  export const Pie: any
  export const Radar: any
  export const Scatter: any
  export const XAxis: any
  export const YAxis: any
  export const CartesianGrid: any
  export const Tooltip: any
  export const Legend: any
  export const Cell: any
  export const LabelList: any
  export const ReferenceLine: any
  export const ReferenceArea: any
  export const ReferenceDot: any
  export const ErrorBar: any
  export const Funnel: any
  export const FunnelChart: any
  export const Treemap: any
  export const TreemapChart: any
  export const Sankey: any
  export const RadialBarChart: any
  export const RadialBar: any
  export const PolarGrid: any
  export const PolarAngleAxis: any
  export const PolarRadiusAxis: any
}

declare module 'input-otp' {
  export const OTPInput: any
  export const SlotProps: any
  export const REGEXP_ONLY_DIGITS: any
  export const REGEXP_ONLY_CHARS: any
  export const REGEXP_ONLY_DIGITS_AND_CHARS: any
}

declare module 'sonner' {
  export const toast: any
  export const Toaster: any
}

// Icônes supplémentaires
declare module 'lucide-react' {
  export const Users: any
  export const Trophy: any
  export const Heart: any
  export const Zap: any
  export const Gamepad2: any
  export const Stadium: any
  export const MessageCircle: any
  export const Coins: any
  export const Crown: any
  export const Frown: any
  export const Meh: any
  export const Radius: any
  export const Sparkles: any
  export const Volume2: any
  export const Settings: any
  export const UserPlus: any
  export const TrendingUp: any
  export const TrendingDown: any
  export const Target: any
  export const Fire: any
  export const Plus: any
  export const ArrowRight: any
  export const ArrowUpRight: any
  export const ArrowDownLeft: any
  export const Timer: any
  export const Mic: any
  export const MicOff: any
  export const Smile: any
  export const ImageIcon: any
  export const Send: any
  export const Wallet: any
  export const Copy: any
  export const ExternalLink: any
  export const History: any
  export const ChevronDown: any
  export const ChevronUp: any
  export const ChevronLeft: any
  export const ChevronRight: any
  export const Shield: any
  export const Star: any
  export const Bell: any
  export const Search: any
  export const User: any
  export const Home: any
  export const ShoppingCart: any
  export const BarChart3: any
  export const Menu: any
  export const X: any
  export const Calendar: any
  export const Award: any
  export const Gift: any
  export const Clock: any
  export const Flame: any
  export const Eye: any
  export const EyeOff: any
  export const Camera: any
  export const Share2: any
  export const Download: any
  export const MoreVertical: any
  export const MoreHorizontal: any
  export const ArrowUpDown: any
  export const Lock: any
  export const Calculator: any
  export const QrCode: any
  export const Minus: any
  export const LogOut: any
  export const Check: any
  export const ChevronsUpDown: any
  export const Circle: any
  export const Dot: any
  export const AlertCircle: any
  export const AlertTriangle: any
  export const Info: any
  export const CheckCircle: any
  export const XCircle: any
  export const HelpCircle: any
  export const Loader2: any
  export const Spinner: any
  export const Upload: any
  export const FileText: any
  export const Image: any
  export const Video: any
  export const Music: any
  export const Headphones: any
  export const Play: any
  export const Pause: any
  export const Stop: any
  export const SkipBack: any
  export const SkipForward: any
  export const Repeat: any
  export const Shuffle: any
  export const Volume: any
  export const VolumeX: any
  export const Volume1: any
  export const Maximize: any
  export const Minimize: any
  export const RotateCcw: any
  export const RotateCw: any
  export const RefreshCw: any
  export const RefreshCcw: any
  export const Trash: any
  export const Trash2: any
  export const Edit: any
  export const Edit2: any
  export const Edit3: any
  export const Save: any
  export const Folder: any
  export const FolderOpen: any
  export const File: any
  export const FileCheck: any
  export const FilePlus: any
  export const FileMinus: any
  export const FileX: any
  export const Grid: any
  export const List: any
  export const Layout: any
  export const Sidebar: any
  export const PanelLeft: any
  export const PanelRight: any
  export const PanelTop: any
  export const PanelBottom: any
  export const Columns: any
  export const Rows: any
  export const Square: any
  export const Rectangle: any
  export const Triangle: any
  export const Hexagon: any
  export const Octagon: any
  export const Pentagon: any
  export const Diamond: any
  export const Heart: any
  export const Star: any
  export const Bookmark: any
  export const BookmarkPlus: any
  export const BookmarkMinus: any
  export const BookmarkX: any
  export const BookmarkCheck: any
  export const Tag: any
  export const Tags: any
  export const Hash: any
  export const AtSign: any
  export const Percent: any
  export const Dollar: any
  export const Euro: any
  export const Pound: any
  export const Yen: any
  export const Bitcoin: any
  export const CreditCard: any
  export const Banknote: any
  export const PiggyBank: any
  export const TrendingUp: any
  export const TrendingDown: any
  export const Activity: any
  export const BarChart: any
  export const BarChart2: any
  export const BarChart3: any
  export const BarChart4: any
  export const LineChart: any
  export const PieChart: any
  export const DoughnutChart: any
  export const AreaChart: any
  export const ScatterChart: any
  export const RadarChart: any
  export const Gauge: any
  export const Thermometer: any
  export const Battery: any
  export const BatteryLow: any
  export const Wifi: any
  export const WifiOff: any
  export const Signal: any
  export const SignalHigh: any
  export const SignalLow: any
  export const SignalMedium: any
  export const SignalZero: any
  export const Bluetooth: any
  export const BluetoothConnected: any
  export const BluetoothSearching: any
  export const Usb: any
  export const HardDrive: any
  export const Server: any
  export const Database: any
  export const Cloud: any
  export const CloudDownload: any
  export const CloudUpload: any
  export const CloudRain: any
  export const CloudSnow: any
  export const CloudSun: any
  export const Sun: any
  export const Moon: any
  export const Sunrise: any
  export const Sunset: any
  export const CloudDrizzle: any
  export const CloudLightning: any
  export const Zap: any
  export const ZapOff: any
  export const Flashlight: any
  export const FlashlightOff: any
  export const Lightbulb: any
  export const LightbulbOff: any
  export const Candle: any
}

declare module '@wagmi/core' {
  export const getAccount: any
  export const getBalance: any
  export const readContract: any
  export const writeContract: any
  export const watchAccount: any
}

declare module 'viem' {
  export const createPublicClient: any
  export const createWalletClient: any
  export const http: any
  export const parseEther: any
  export const formatEther: any
}

declare module '@/components/ui/card' {
  export const Card: any
  export const CardContent: any
  export const CardHeader: any
  export const CardTitle: any
  export const CardDescription: any
  export const CardFooter: any
}

declare module '@/components/ui/button' {
  export const Button: any
  export const buttonVariants: any
  export type ButtonProps = any
}

declare module '@/components/ui/badge' {
  export const Badge: any
}

declare module '@/components/ui/input' {
  export const Input: any
}

declare module '@/components/ui/avatar' {
  export const Avatar: any
  export const AvatarFallback: any
  export const AvatarImage: any
}

declare module '@/components/ui/separator' {
  export const Separator: any
}

declare module '@/components/ui/progress' {
  export const Progress: any
}

declare module '@/components/ui/tabs' {
  export const Tabs: any
  export const TabsContent: any
  export const TabsList: any
  export const TabsTrigger: any
}

declare module '@/components/ui/dropdown-menu' {
  export const DropdownMenu: any
  export const DropdownMenuContent: any
  export const DropdownMenuItem: any
  export const DropdownMenuLabel: any
  export const DropdownMenuSeparator: any
  export const DropdownMenuTrigger: any
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

// Désactiver les vérifications strictes pour React Three Fiber
declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
  
  // Surcharger les types Vector3 pour accepter les arrays
  interface Vector3 {
    x: number
    y: number
    z: number
  }
  
  type Vector3Array = [number, number, number]
  
  // Compatibilité avec les arrays
  interface Array<T> {
    x?: number
    y?: number
    z?: number
  }
} 

// Déclarations Three.js manquantes
declare module 'three' {
  export class PerspectiveCamera {
    constructor(fov?: number, aspect?: number, near?: number, far?: number)
    position: Vector3
    rotation: Euler
    lookAt(vector: Vector3): void
    updateProjectionMatrix(): void
    [key: string]: any
  }
  
  export class Points {
    constructor(geometry?: BufferGeometry, material?: Material)
    position: Vector3
    rotation: Euler
    scale: Vector3
    [key: string]: any
  }
  
  export class BufferGeometry {
    constructor()
    setAttribute(name: string, attribute: BufferAttribute): void
    attributes: { [key: string]: BufferAttribute }
    [key: string]: any
  }
  
  export class BufferAttribute {
    constructor(array: ArrayLike<number>, itemSize: number, normalized?: boolean)
    needsUpdate: boolean
    [key: string]: any
  }
  
  export class PointsMaterial {
    constructor(parameters?: any)
    size: number
    vertexColors: boolean
    transparent: boolean
    opacity: number
    sizeAttenuation: boolean
    [key: string]: any
  }
  
  export class Material {
    [key: string]: any
  }
  
  export class Euler {
    constructor(x?: number, y?: number, z?: number, order?: string)
    x: number
    y: number
    z: number
    [key: string]: any
  }
  
  // Réexporter les classes déjà déclarées
  export class Vector3 {
    constructor(x?: number, y?: number, z?: number)
    x: number
    y: number
    z: number
    set(x: number, y: number, z: number): this
    lerp(vector: Vector3, alpha: number): this
    setScalar(scalar: number): this
    [key: string]: any
  }
  
  export class Group {
    children: any[]
    position: Vector3
    rotation: Euler
    scale: Vector3
    userData: any
    [key: string]: any
  }
  
  export class Mesh {
    position: Vector3
    rotation: Euler
    scale: Vector3
    material: Material
    geometry: BufferGeometry
    userData: any
    [key: string]: any
  }
}

// Déclarations @react-three/fiber étendues
declare module '@react-three/fiber' {
  interface PointLightProps {
    position?: Vector3 | [number, number, number]
    color?: string
    intensity?: number
    distance?: number
    [key: string]: any
  }
  
  interface MeshProps {
    position?: Vector3 | [number, number, number]
    rotation?: Euler | [number, number, number]
    scale?: Vector3 | [number, number, number] | number
    [key: string]: any
  }
  
  interface PointsProps {
    [key: string]: any
  }
  
  interface GroupProps {
    position?: Vector3 | [number, number, number]
    rotation?: Euler | [number, number, number]
    scale?: Vector3 | [number, number, number] | number
    [key: string]: any
  }
  
  // Permettre l'utilisation de arrays comme Vector3
  type Vector3 = [number, number, number] | { x: number, y: number, z: number }
  type Euler = [number, number, number] | { x: number, y: number, z: number }
}

// Déclarations globales pour JSX avec Three.js
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Géométries
      boxGeometry: { args?: [number, number, number] }
      sphereGeometry: { args?: [number, number?, number?] }
      cylinderGeometry: { args?: [number, number, number] }
      planeGeometry: { args?: [number, number] }
      ringGeometry: { args?: [number, number] }
      circleGeometry: { args?: [number] }
      
      // Matériaux
      meshStandardMaterial: { 
        color?: string
        roughness?: number
        metalness?: number
        transparent?: boolean
        opacity?: number
        [key: string]: any
      }
      meshBasicMaterial: { 
        color?: string
        transparent?: boolean
        opacity?: number
        [key: string]: any
      }
      pointsMaterial: {
        size?: number
        vertexColors?: boolean
        transparent?: boolean
        opacity?: number
        sizeAttenuation?: boolean
        [key: string]: any
      }
      
      // Lumières
      spotLight: { 
        position?: [number, number, number]
        target?: [number, number, number]
        color?: string
        intensity?: number
        distance?: number
        [key: string]: any
      }
      directionalLight: { 
        position?: [number, number, number]
        color?: string
        intensity?: number
        [key: string]: any
      }
      ambientLight: { 
        color?: string
        intensity?: number
        [key: string]: any
      }
      hemisphereLight: { 
        skyColor?: string
        groundColor?: string
        intensity?: number
        [key: string]: any
      }
      pointLight: { 
        position?: [number, number, number]
        color?: string
        intensity?: number
        distance?: number
        [key: string]: any
      }
      
      // Objets 3D
      group: { 
        position?: [number, number, number]
        rotation?: [number, number, number]
        scale?: [number, number, number] | number
        [key: string]: any
      }
      mesh: { 
        position?: [number, number, number]
        rotation?: [number, number, number]
        scale?: [number, number, number] | number
        castShadow?: boolean
        receiveShadow?: boolean
        [key: string]: any
      }
      points: {
        [key: string]: any
      }
      
      // Primitives
      primitive: { 
        object: any
        [key: string]: any
      }
      
      // Audio
      positionalAudio: { [key: string]: any }
      
      // Environnement
      fog: { [key: string]: any }
      
      // Catch-all pour autres éléments
      [elemName: string]: any
    }
  }
} 

// Déclarations Three.js supplémentaires
declare module 'three' {
  export class Color {
    constructor(color?: string | number)
    [key: string]: any
  }
  
  export class Fog {
    constructor(color?: string | number, near?: number, far?: number)
    [key: string]: any
  }
  
  export const PCFSoftShadowMap: any
  export const SRGBColorSpace: any
  export const ACESFilmicToneMapping: any
  export const DoubleSide: any
  
  // ... rest of existing declarations ...
}

// Déclarations @react-three/drei supplémentaires
declare module '@react-three/drei' {
  export const OrbitControls: any
  export const Environment: any
  export const PerspectiveCamera: any
  export const Stats: any
  export const Text: any
  export const Billboard: any
  export const Loader: any
  export const Html: any
  export const useProgress: any
  export const useGLTF: any
  export const useTexture: any
  export const Sky: any
  export const ContactShadows: any
  export const Float: any
  export const Sparkles: any
  export const Stars: any
  export const Cloud: any
  export const Clouds: any
  export const Effects: any
  export const EffectComposer: any
  export const Bloom: any
  export const DepthOfField: any
  export const Noise: any
  export const Vignette: any
  export const GodRays: any
  export const SSAO: any
  export const SSR: any
  export const Outline: any
  export const Selection: any
  export const Select: any
  export const BakeShadows: any
  export const softShadows: any
  export const meshBounds: any
  export const useBounds: any
  export const Bounds: any
  export const CameraShake: any
  export const FlyControls: any
  export const DeviceOrientationControls: any
  export const TrackballControls: any
  export const ArcballControls: any
  export const FirstPersonControls: any
  export const PointerLockControls: any
  export const TransformControls: any
  export const PivotControls: any
  export const DragControls: any
  export const useAnimations: any
  export const useFBX: any
  export const useKTX2: any
  export const Detailed: any
  export const Preload: any
  export const BBAnchor: any
  export const Grid: any
  export const GizmoHelper: any
  export const GizmoViewport: any
  export const GizmoViewcube: any
  export const Stage: any
  export const Backdrop: any
  export const Shadow: any
  export const AccumulativeShadows: any
  export const RandomizedLight: any
  export const SpotLight: any
  export const DirectionalLight: any
  export const PointLight: any
  export const RectAreaLight: any
  export const Ring: any
  export const Tube: any
  export const Sphere: any
  export const Box: any
  export const Cone: any
  export const Cylinder: any
  export const Dodecahedron: any
  export const Icosahedron: any
  export const Octahedron: any
  export const Plane: any
  export const Polyhedron: any
  export const Tetrahedron: any
  export const Torus: any
  export const TorusKnot: any
  export const Circle: any
  export const Extrude: any
  export const Lathe: any
  export const Parametric: any
  export const RoundedBox: any
  export const ScreenQuad: any
  export const Line: any
  export const QuadraticBezierLine: any
  export const CubicBezierLine: any
  export const CatmullRomLine: any
  export const Facemesh: any
  export const Decal: any
  export const Svg: any
  export const AsciiRenderer: any
  export const Wireframe: any
  export const MeshDistortMaterial: any
  export const MeshWobbleMaterial: any
  export const MeshReflectorMaterial: any
  export const MeshRefractionMaterial: any
  export const MeshTransmissionMaterial: any
  export const MeshDiscardMaterial: any
  export const shaderMaterial: any
  export const softShadows: any
  export const ContactShadows: any
  export const BakeShadows: any
  export const AccumulativeShadows: any
  export const RandomizedLight: any
  export const Lightformer: any
  export const useMatcapTexture: any
  export const useNormalTexture: any
  export const useCubeTexture: any
  export const useEnvironment: any
  export const Lightmap: any
  export const ShadowAlpha: any
  export const SpotLightShadow: any
  export const CameraControls: any
  export const MapControls: any
  export const ScrollControls: any
  export const PresentationControls: any
  export const KeyboardControls: any
  export const FaceControls: any
  export const useKeyboardControls: any
  export const useScroll: any
  export const Image: any
  export const Video: any
  export const Mask: any
  export const MeshPortalMaterial: any
  export const CameraShake: any
  export const Fisheye: any
  export const useCursor: any
  export const useHelper: any
  export const useAspect: any
  export const useCamera: any
  export const useDetectGPU: any
  export const useContextBridge: any
  export const useIntersect: any
  export const usePolarCoordinates: any
  export const useScroll: any
  export const useVideoTexture: any
  export const useDepthBuffer: any
  export const useFBO: any
  export const useRenderTarget: any
  export const RenderTexture: any
  export const PerspectiveCamera: any
  export const OrthographicCamera: any
  export const CubeCamera: any
  export const View: any
  export const RenderCubeTexture: any
  export const Sampler: any
  export const ComputedAttribute: any
  export const Points: any
  export const Point: any
  export const PointMaterial: any
  export const Trail: any
  export const Segments: any
  export const SegmentObject: any
  export const Edges: any
  export const Outlines: any
  export const Trail: any
  export const Animate: any
  export const useSpring: any
  export const a: any
  export const animated: any
  export const config: any
  export const easings: any
  export const useChain: any
  export const useSpringRef: any
  export const useSpringValue: any
  export const useSpringStyle: any
  export const useTransition: any
  export const useTrail: any
  export const Bvh: any
  export const useBVH: any
  export const MeshBVH: any
  export const MeshBVHVisualizer: any
  export const shaderMaterial: any
  export const DiscardMaterial: any
  export const ShadowMaterial: any
  export const SpriteMaterial: any
  export const meshPhysicalMaterial: any
  export const meshStandardMaterial: any
  export const meshBasicMaterial: any
  export const meshLambertMaterial: any
  export const meshPhongMaterial: any
  export const meshToonMaterial: any
  export const meshNormalMaterial: any
  export const meshDepthMaterial: any
  export const meshDistanceMaterial: any
  export const meshMatcapMaterial: any
  export const rawShaderMaterial: any
  export const lineBasicMaterial: any
  export const lineDashedMaterial: any
  export const pointsMaterial: any
  export const shadowMaterial: any
  export const spriteMaterial: any
} 