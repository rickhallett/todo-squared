class TodoList {
    constructor() {
        this.$root = [];
    }
}

class Todo {
    constructor( text, parent ) {
        this.id = utils.generateID();
        this.parent = parent || '$root';
        this.text = text;
        this.completed = false;
        this.dateCreated = new Date();
        this.subTodo = null;
        this.isExpanded = false;
        this.isActive = false;
    }

    edit( text ) {
        this.text = text;
        this.dateModified = new Date();
    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
    }

    toggleActive() {
        this.isActive = !this.isActive;
    }
}