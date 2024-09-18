export default class ModeloFiltering {
    constructor() {
        this.data = {};
    }

    getPercentages(callback, ...params) {
        this.data = {
            'safica': -1,
            'sameal': -1,
            'reines': -1,
            'esaceo': -1,
            'defiro': -1,
            'edenal': -1,
            'total': -1,
        };

        const keys = Object.keys(this.data).slice(0, 6);

        let excludedAreas = ($('p#info').attr('data-id-areas') != '') 
            ? JSON.parse($('p#info').attr('data-id-areas')) 
            : [];

        keys.forEach((key, index) => {
            if (excludedAreas.length == 0 || excludedAreas.includes(index)) {
                const id = index; 
                const selector = `[data-id-area="${id}"]`;

                const rows = $('td.td-data')
                    .find('button')
                    .filter(selector)
                    .closest('tr')
                    .filter(function() {
                        return $(this).is(':visible');
                    });

                this.data[key] = rows.length;
            }
        });

        this.data.total = Object.values(this.data).reduce((a, b) => a + (b >= 0 ? b : 0), 0);

        callback(this.data);
    }
}
