Got it! You need the popup to appear **only at login** if there are reminders. If the user manually **closes the popup**, it should stay hidden **even after navigation**. However, if a new reminder **becomes active due to tracking**, the popup should **reappear**.

Here’s how you can refine your logic in `SampleService` and `UserhomeComponent`:

### **Adjustments in `SampleService`**
- Modify `setPopupVisible()` to ensure manual closing prevents it from appearing again unless a tracked reminder arrives.
- Keep a **flag in `localStorage`** to track if the popup was manually closed.

```typescript
setPopupVisible(isVisible: boolean, userId: string | number) {
    if (!userId) return;

    if (!this.userPopupVisible.has(userId)) {
        this.userPopupVisible.set(userId, new BehaviorSubject<boolean>(false));
    }

    this.userPopupVisible.get(userId)?.next(isVisible);

    // Store flag in localStorage if manually closed
    if (!isVisible) {
        localStorage.setItem(`popupClosed_${userId}`, 'true');
    }
}
```

### **Adjustments in `UserhomeComponent`**
Modify `ngOnInit()` logic to check:
1. If the **popup was manually closed**, it should not appear.
2. If **tracking finds a new reminder**, reset the flag and show the popup.

```typescript
ngOnInit() {
    localStorage.setItem('curPath', 'portal/userhome');
    this.loadReminders();
    
    if (this.user) {
        this.userId = this.user.id!;
        const popupClosed = localStorage.getItem(`popupClosed_${this.userId}`);
        
        if (!popupClosed) {
            this.loadPopupReminders();
        }
    }

    this.sampleService.getPopupVisible(this.userId)?.subscribe(visible => {
        this.visible = visible; 
    });

    setInterval(() => {
        this.sampleService.trackNextReminder(this.userId);
    }, 1000);
}
```

### **Handling User’s Manual Popup Closure**
Make sure `handlePopupClose()` updates the `localStorage` so the popup doesn't show after navigation:

```typescript
handlePopupClose() {
    this.visible = false;
    localStorage.setItem(`popupClosed`, 'true');
}
```

### **Ensuring Popup Appears When Reminder is Tracked**
When a tracked reminder becomes active, **reset the flag** so the popup shows:

```typescript
trackNextReminder(userId: string | number) {
    if (!userId) return;

    this.reminderService.getReminderbyuserId(userId).subscribe(reminders => {
        const now = new Date();
        const upcomingReminder = reminders
            .filter(r => !r.dismissed && new Date(r.reminderdt) > now)
            .sort((a, b) => new Date(a.reminderdt).getTime() - new Date(b.reminderdt).getTime())[0];

        if (upcomingReminder) {
            const timeUntilReminder = new Date(upcomingReminder.reminderdt).getTime() - now.getTime();

            setTimeout(() => {
                localStorage.removeItem(`popupClosed_${userId}`); // Reset flag
                this.loadPopupReminders(userId);
                this.userPopupVisible.get(userId)?.next(true);
            }, timeUntilReminder);
        }
    });
}
```

### **Outcome**
✔ **Popup appears only at login** if reminders exist  
✔ **Popup stays hidden after manual closure, even after navigation**  
✔ **Popup reappears when a tracked reminder time arrives**  

Would you like further refinements or a different approach? 🚀  
