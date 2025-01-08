export class Email {
    constructor(private value: string) {
      if (!this.isValid(value)) {
        throw new Error('Invalid email format');
      }
    }
  
    private isValid(email: string): boolean {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
  
    getValue(): string {
      return this.value;
    }
  }
  