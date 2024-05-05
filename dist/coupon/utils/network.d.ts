interface Network {
    prefixes: string[];
    name: string;
}
interface GloMap {
    error: boolean;
    plan_id: number;
}
export declare const networksJson: Network[];
export declare const glo_wisper_size_map: (size: string) => GloMap;
export {};
