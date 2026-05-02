export function formatNumberCompact(num: number): string {
    if(num < 1e6) {
        return num.toString();
    } else if( num < 1e9) {
        return `${(num/1e6).toFixed(2)}M`
    } else {
        return `${(num/1e9).toFixed(2)}B`
    }
}