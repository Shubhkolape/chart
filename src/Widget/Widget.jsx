import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import CobrowseReports from '../pages/CobrowseReports';

class widgetComp extends HTMLElement {
    connectedCallback() {
        const interactionId = this.getAttribute('interactionid');
        console.log('interaction ID ===================> ', interactionId);
        render(createElement(CobrowseReports, { interactionId }), this);
    }

    disconnectedCallback() {
        unmountComponentAtNode(CobrowseReports);
    }
}

customElements.define('cobrowse-reports-widget-react', widgetComp);
