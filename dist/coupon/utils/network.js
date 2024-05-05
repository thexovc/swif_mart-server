"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.glo_wisper_size_map = exports.networksJson = void 0;
exports.networksJson = [
    {
        prefixes: [
            '0803',
            '0806',
            '0810',
            '0813',
            '0814',
            '0816',
            '0702',
            '0703',
            '0704',
            '0706',
            '0903',
            '0906',
            '0913',
            '0916',
        ],
        name: 'mtn',
    },
    {
        prefixes: ['0805', '0807', '0811', '0815', '0705', '0905', '0915'],
        name: 'glo',
    },
    {
        prefixes: [
            '0802',
            '0808',
            '0812',
            '0701',
            '0708',
            '0901',
            '0902',
            '0904',
            '0907',
            '0912',
            '0911',
        ],
        name: 'airtel',
    },
    { prefixes: ['0809', '0817', '0818', '0908', '0909'], name: '9mobile' },
];
const glo_wisper_size_map = (size) => {
    const f_size = size.trim().toLowerCase().replace(' ', '');
    let error = false, plan_id;
    switch (f_size) {
        case '200mb':
            plan_id = 701;
            break;
        case '500mb':
            plan_id = 702;
            break;
        case '1gb':
            plan_id = 703;
            break;
        case '2gb':
            plan_id = 704;
            break;
        case '3gb':
            plan_id = 705;
            break;
        case '5gb':
            plan_id = 706;
            break;
        case '10gb':
            plan_id = 707;
            break;
        default:
            error = true;
    }
    return { error, plan_id };
};
exports.glo_wisper_size_map = glo_wisper_size_map;
//# sourceMappingURL=network.js.map