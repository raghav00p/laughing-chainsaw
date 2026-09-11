const db = new Dexie("MyAppDB", {
  addons: [DexieCloud.dexieCloud]
});

db.version(1).stores({
  notes: "id, createdAt"
});

db.cloud.configure({
  databaseUrl: "https://zhvnsd946.dexie.cloud",
  requireAuth: true
});


// Alpine.js component
function storageApp() {
  return {
    quickNote: "",
    newNote: "",
    notes: [],
    errorMessage: "",

    async init() {
      try {
        this.quickNote = localStorage.getItem("myNote") || "";

        await db.open();
        await this.loadNotes();

      } catch (error) {
        this.handleError(
          "Failed to initialize application",
          error
        );
      }
    },


    saveQuickNote() {
      try {
        localStorage.setItem("myNote", this.quickNote);

      } catch (error) {
        this.handleError(
          "Failed to save quick note",
          error
        );
      }
    },


    async addNote() {
      try {
        const noteText = this.newNote.trim();

        if (!noteText) {
          throw new Error("Please enter a note");
        }

        // Create a UUID for Dexie Cloud
        const id = crypto.randomUUID();

        await db.notes.add({
          id: id,
          content: noteText,
          createdAt: new Date()
        });

        this.newNote = "";

        await this.loadNotes();

      } catch (error) {
        this.handleError(
          "Failed to add note",
          error
        );
      }
    },


    async loadNotes() {
      try {
        this.notes = await db.notes
          .orderBy("createdAt")
          .reverse()
          .toArray();

      } catch (error) {
        this.handleError(
          "Failed to load notes",
          error
        );
      }
    },


    async deleteNote(id) {
      try {
        await db.notes.delete(id);

        await this.loadNotes();

      } catch (error) {
        this.handleError(
          "Failed to delete note",
          error
        );
      }
    },


    formatDate(date) {
      return new Date(date).toLocaleString();
    },


    handleError(message, error) {
      console.error(message, error);

      this.errorMessage =
        message + ": " +
        (error.message || "Unknown error");
    }
  };
}
