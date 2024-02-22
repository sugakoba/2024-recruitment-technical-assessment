
type FileData = {
    id: number,
    name: string,
    categories: string[],
    parent: number
    size: number
};

/* Helper functions */

/**
 * Create a tree structure for all files
 */
function filesTree(files: FileData[]): Map<number, FileData[]> {
    const tree = new Map<number, FileData[]>();

    files.forEach(file => {
        if (file.parent === -1 && !tree.has(file.id)) { // root files
            tree.set(file.id, []);
        } else {
            if (!tree.has(file.parent)) {
                tree.set(file.parent, [])
            }
            tree.get(file.parent)?.push(file) 
        }
    })

    return tree;
}

/**
 * Calculates the total size of a file, including all its children files
 */
function totalSize(file: FileData, tree: Map<number, FileData[]>): number {
    let total = 0;

    total += file.size;
    const children = tree.get(file.id) || [];
    children.forEach(child => {
        total += totalSize(child, tree);
    });

    return total;
}


/**
 * Task 1
 */
function leafFiles(files: FileData[]): string[] {
    const parents = new Set<number>();
    const leaves: string[] = []
    
    files.forEach(file => parents.add(file.parent))
    files.forEach(file => {
        if (!parents.has(file.id)) {
            leaves.push(file.name);
        }
    });

    // Another approach is to use tree helper function:

    // const tree = filesTree(files);
    // files.forEach(file => {
    //     const children = tree.get(file.id)
    //     if (children === undefined || children.length === 0) {
    //         leaves.push(file.name);
    //     }
    // })
    
    return leaves;
}

/**
 * Task 2
 */
function kLargestCategories(files: FileData[], k: number): string[] {
    const filesMap = new Map<string, number>();

    files.forEach(file => {
        file.categories.forEach(category => {
            // if category exists then current no. of files + 1
            // else set new category in map
            const curr = filesMap.get(category) || 0;
            filesMap.set(category, curr + 1);
        });
    });

    const sortedCategories = Array.from(filesMap)
        .sort(([c1, n1], [c2, n2]) => n2 - n1 || c1.localeCompare(c2))
        .slice(0, k)
        .map(([category]) => category);

    return sortedCategories;
}

/**
 * Task 3
 */
function largestFileSize(files: FileData[]): number {
    if (files.length === 0) return 0;

    const tree = filesTree(files);
    let largest = 0;
    files.forEach(file => {
        const size = totalSize(file, tree);
        if (size > largest) {
            largest = size
        }
    })

    return largest;
}


function arraysEqual<T>(a: T[], b: T[]): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

const testFiles: FileData[] = [
    { id: 1, name: "Document.txt", categories: ["Documents"], parent: 3, size: 1024 },
    { id: 2, name: "Image.jpg", categories: ["Media", "Photos"], parent: 34, size: 2048 },
    { id: 3, name: "Folder", categories: ["Folder"], parent: -1, size: 0 },
    { id: 5, name: "Spreadsheet.xlsx", categories: ["Documents", "Excel"], parent: 3, size: 4096 },
    { id: 8, name: "Backup.zip", categories: ["Backup"], parent: 233, size: 8192 },
    { id: 13, name: "Presentation.pptx", categories: ["Documents", "Presentation"], parent: 3, size: 3072 },
    { id: 21, name: "Video.mp4", categories: ["Media", "Videos"], parent: 34, size: 6144 },
    { id: 34, name: "Folder2", categories: ["Folder"], parent: 3, size: 0 },
    { id: 55, name: "Code.py", categories: ["Programming"], parent: -1, size: 1536 },
    { id: 89, name: "Audio.mp3", categories: ["Media", "Audio"], parent: 34, size: 2560 },
    { id: 144, name: "Spreadsheet2.xlsx", categories: ["Documents", "Excel"], parent: 3, size: 2048 },
    { id: 233, name: "Folder3", categories: ["Folder"], parent: -1, size: 4096 },
];

console.assert(arraysEqual(
    leafFiles(testFiles).sort((a, b) => a.localeCompare(b)),
    [
        "Audio.mp3",
        "Backup.zip",
        "Code.py",
        "Document.txt",
        "Image.jpg",
        "Presentation.pptx",
        "Spreadsheet.xlsx",
        "Spreadsheet2.xlsx",
        "Video.mp4"
    ]
));

console.assert(arraysEqual(
    kLargestCategories(testFiles, 3),
    ["Documents", "Folder", "Media"]
));

console.assert(largestFileSize(testFiles) == 20992)
