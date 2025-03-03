require('./index.css').toString();
const icons = require('@codexteam/icons');

class AlignmentBlockTune {

    /**
     * Default alignment
     *
     * @public
     * @returns {string}
     */
    static get DEFAULT_ALIGNMENT() {
        return 'left';
    }

    static get isTune() {
        return true;
    }

    getAlignment(){
        if (!!this.config?.blocks && this.config.blocks.hasOwnProperty(this.block.name)) {
            return this.config.blocks[this.block.name];
        }

        if (this.config?.default) {
            return this.config.default;
        }

        return AlignmentBlockTune.DEFAULT_ALIGNMENT;
    }

    /**
     * @param api
     * @param data tune data
     * @param config tune config
     * @param block tune block
     */
    constructor({ api, data, config, block}) {
        this.api = api;
        this.block = block;
        /**
         config:{
            default: "right",
            blocks: {
              header: 'center',
              list: 'right'
            }
          },
         */
        this.config = config;
        this.data = data || { alignment: this.getAlignment() };
        this.alignmentSettings = [
            {
                value: 'left',
                name: 'Left',
                icon: icons.IconAlignLeft
            },
            {
                value: 'center',
                name: 'Center',
                icon: icons.IconAlignCenter
            },
            {
                value: 'right',
                name: 'Right',
                icon: icons.IconAlignRight
            },
        ];
        this._CSS = {
            alignment: {
                left: 'ce-tune-alignment--left',
                center: 'ce-tune-alignment--center',
                right: 'ce-tune-alignment--right'
            }
        }
    }

    wrap(blockContent) {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.toggle(this._CSS.alignment[this.data.alignment]);
        this.wrapper.append(blockContent);

        return this.wrapper;
    }

    setAlignment(alignment) {
        this.data = {
            alignment: alignment,
        };

        this.wrapper.classList.remove(...Object.values(this._CSS.alignment));
        this.wrapper.classList.toggle(this._CSS.alignment[alignment], alignment === this.data.alignment);

        this.block.dispatchChange();
    }

    render() {
        const options = this.alignmentSettings.map((item) => ({
            icon: item.icon,
            title: this.api.i18n.t(item.name),
            onActivate: () => {
                this.setAlignment(item.value);
            },
            isActive: this.data.alignment === item.value,
            closeOnActivate: true,
        }));

        const separator = { type: 'separator' };

        return [
            ...(this.config?.viewSeparatorAbove ? [separator] : []),
            {
                name: 'alignment',
                title: this.api.i18n.t('Alignment'),
                icon: icons.IconAlignLeft,
                children: {
                    items: options
                },
            },
            ...(this.config?.viewSeparatorBelow ? [separator] : []),
        ].filter((item) => Object.keys(item).length);
    }

    save() {
        return this.data;
    }
}

module.exports = AlignmentBlockTune;
