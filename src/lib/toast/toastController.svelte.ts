const DEFAULT_TOAST_DURATION: number = 3000

type ToastInstance = {
  open: (message: string, duration?: number) => void;
  close: () => void;
};
class ToastController {
  private instance: ToastInstance | null = null;

  register(ref: ToastInstance): void {
    this.instance = ref;
  }

  open(message: string, duration: number = DEFAULT_TOAST_DURATION): void {
    this.instance?.open(message, duration);
  }

  close(): void {
    this.instance?.close();
  }
}

let toast = new ToastController();
export { toast, DEFAULT_TOAST_DURATION }