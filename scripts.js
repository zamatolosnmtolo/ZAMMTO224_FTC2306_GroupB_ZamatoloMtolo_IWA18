import { TABLES, COLUMNS, state, createOrderData, updateDragging, createOrderHtml, moveToColumn, updateDraggingHtml } from './view.js';

document.addEventListener('DOMContentLoaded', () => {
    const html = {
        // ... (your existing code)
    };

    // Event listener for the "?" icon to open the "Help" overlay
    document.getElementById('help-button').addEventListener('click', handleHelpToggle);

    // Event listener for the "Update" button in the "Edit Order" overlay
    document.getElementById('update-button').addEventListener('click', handleEditSubmit);

    // Function to set focus on the "Add Order" button
    const setFocusOnAddButton = () => {
        html.other.add.focus();
    };

    // Event handler for opening the "Add Order" overlay
    const handleAddToggle = () => {
        html.add.overlay.showModal();
        html.add.title.value = '';
        html.add.table.selectedIndex = 0;
    };

    // Event handler for submitting the "Add Order" form
    const handleAddSubmit = (event) => {
        event.preventDefault();

        const title = html.add.title.value.trim();
        const table = html.add.table.value;

        if (title && table) {
            const order = createOrderData({ title, table, column: 'ordered' });
            state.orders[order.id] = order;

            const orderElement = createOrderHtml(order);
            html.columns.ordered.appendChild(orderElement);

            html.add.overlay.close();
            setFocusOnAddButton(); // Return focus to "Add Order" button
        }
    };

    // Event handler for closing an overlay (Add Order, Edit Order, or Help)
    const handleCloseOverlay = (event) => {
        const overlay = event.target.closest('dialog');
        if (overlay) {
            overlay.close();
            html.add.overlay.close();
            html.edit.overlay.close();
            html.help.overlay.close();
            html.add.overlay.remove();
            html.edit.overlay.remove();
            html.help.overlay.remove();
            setFocusOnAddButton(); // Focus back to "Add Order" button
        }
    };

    // Event handler for updating an order in the "Edit Order" overlay
    const handleEditSubmit = (event) => {
        event.preventDefault();

        const orderId = html.edit.id.value;
        const order = state.orders[orderId];

        if (!order) return;

        const newTitle = html.edit.title.value.trim();
        const newTable = html.edit.table.value;
        const newColumn = html.edit.column.value;

        if (newTitle && newTable && newColumn) {
            order.title = newTitle;
            order.table = newTable;
            order.column = newColumn;

            const orderElement = document.querySelector(`[data-id="${orderId}"]`);
            if (orderElement) {
                orderElement.querySelector('[data-order-title]').textContent = newTitle;
                orderElement.querySelector('[data-order-table]').textContent = newTable;
            }

            if (newColumn !== order.column) {
                moveToColumn(orderId, newColumn);
                order.column = newColumn;
            }
        }

        html.edit.overlay.close();
        setFocusOnAddButton(); // Return focus to "Add Order" button
    };

    // ... (your existing code)

    // Initialize event listeners.
    html.add.form.addEventListener('submit', handleAddSubmit);
    html.other.add.addEventListener('click', handleAddToggle);
    html.other.grid.addEventListener('click', handleEditToggle);
    html.edit.overlay.addEventListener('close', handleCloseOverlay);
    html.edit.cancel.addEventListener('click', handleEditToggle);
    html.edit.form.addEventListener('submit', handleEditSubmit);
    html.edit.delete.addEventListener('click', handleDelete);

    for (const htmlColumn of Object.values(html.columns)) {
        htmlColumn.addEventListener('dragstart', handleDragStart);
        htmlColumn.addEventListener('dragend', handleDragEnd);
    }

    for (const htmlArea of Object.values(html.area)) {
        htmlArea.addEventListener('dragover', handleDragOver);
    }

    html.add.table.appendChild(createTableOptionsHtml());
    html.edit.table.appendChild(createTableOptionsHtml());

    /**
     * Helper function to create table options in the "Add Order" and "Edit Order" forms.
     */
    function createTableOptionsHtml() {
        const fragment = document.createDocumentFragment();
        for (const singleTable of TABLES) {
            const option = document.createElement('option');
            option.value = singleTable;
            option.innerText = singleTable;
            fragment.appendChild(option);
        }
        return fragment;
    }

    // ... (your existing code)

});
