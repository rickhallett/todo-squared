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

    //in old implentation, unable to keep reference to these methods once data has been retrieved from storage (as todo data will not be stored as a Todo constructed object: the link is severed)
    /*
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
    */
}