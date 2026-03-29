type ToastInstance = {
  open: (message: string, duration?: number) => void;
  close: () => void;
};
class ToastController {
  private instance: ToastInstance | null = null;

  register(ref: ToastInstance): void {
    this.instance = ref;
  }

  open(message: string, duration: number = 2500): void {
    this.instance?.open(message, duration);
  }

  close(): void {
    this.instance?.close();
  }
}

export const toast = new ToastController();