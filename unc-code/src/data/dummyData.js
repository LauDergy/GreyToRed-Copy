/**
 * ==========================================
 * src/data/dummyData.js
 * ==========================================
 * Centralized placeholder data for the entire app.
 * Replace these with real API/DB calls when the backend is ready.
 *
 * Convention:
 *   Each view accepts its data as a prop.
 *   If no prop is passed, the view falls back to the data exported here.
 */

// ── Student profile (session)────────────────────────────────────────────────────────
export const DUMMY_STUDENT = {
    name: 'John Michael Laureles',
    course: '1st year BSCS',
    studentId: '25-29019',
    // NOTE: tasksCompleted, totalTasks, gradePercentage are now derived
    // dynamically from tasks via computeStudentStats(tasks).
    // In production: GET /api/students/:id/stats
};

// ── Teacher profile (session) ──────────────────────────────────────────────
export const DUMMY_TEACHER = {
    name: 'Danny Casimero',
    title: 'Senior Instructor',
};

// ── Subjects (enrolled by the current student) ─────────────────────────────
export const DUMMY_SUBJECTS = [
    { id: 'BCS221-OCa', name: 'Fundamentals of Programming', instructor: 'Danny Casimero' },
    { id: 'MATH101-CS', name: 'Discrete Mathematics', instructor: 'Maria Santos' },
    { id: 'GE104-UNC', name: 'Art Appreciation', instructor: 'Ricardo Dela Cruz' },
];

// ── Tasks (all tasks across subjects) ─────────────────────────────────────
// score:    INT  — student's earned points (numerator). In production: INT NOT NULL DEFAULT 0
// maxScore: INT  — max possible points for this task.   In production: INT NOT NULL DEFAULT 50
export const DUMMY_TASKS = [
    { id: 'task-1', title: 'Sorting Algorithm', status: 'In Progress', score: 0,  maxScore: 50, isCompleted: false, subjectId: 'BCS221-OCa', deadline: '2026-02-20T23:59', unchecked: 3, problemId: 'prob-1' },
    { id: 'task-2', title: 'Two Sums',          status: 'Completed',   score: 40, maxScore: 50, isCompleted: true,  subjectId: 'BCS221-OCa', deadline: '2026-02-14T23:59', unchecked: 0, problemId: 'prob-2' },
    { id: 'task-3', title: 'Logic Gates',        status: 'In Progress', score: 0,  maxScore: 30, isCompleted: false, subjectId: 'MATH101-CS', deadline: '2026-03-01T23:59', unchecked: 0, problemId: 'prob-3' },
];

// ── Deadline formatter ──────────────────────────────────────────────────
// Usage: formatDeadline(task.deadline)  →  "Feb 20, 2026  11:59 PM"
// All views use this — never display the raw ISO string.
export function formatDeadline(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d)) return iso; // fallback: return as-is if unparseable
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${date}  ${time}`;
}

// ── Student progress stats ────────────────────────────────────────────────
// Usage:
//   const stats = computeStudentStats(allTasks);          // HomeContent
//   const stats = computeStudentStats(subjectTasks);      // SubjectDetailContent
//
// Returns:
//   { tasksCompleted, totalTasks, tasksPct, gradePoints, maxPoints, gradePercentage }
//
// In production: replace with GET /api/students/:id/stats?subjectId=... (optional filter)
export function computeStudentStats(tasks = []) {
    const totalTasks = tasks.length;
    const tasksCompleted = tasks.filter(t => t.isCompleted).length;

    // score and maxScore are now plain integers on each task.
    // In production: SELECT SUM(score), SUM(max_score) FROM tasks WHERE student_id = ?
    let gradePoints = 0;
    let maxPoints = 0;
    tasks.forEach(t => {
        if (t.score != null && t.maxScore > 0) {
            gradePoints += t.score;
            maxPoints   += t.maxScore;
        }
    });

    const tasksPct = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
    const gradePercentage = maxPoints > 0 ? Math.round((gradePoints / maxPoints) * 100) : 0;

    return { tasksCompleted, totalTasks, tasksPct, gradePoints, maxPoints, gradePercentage };
}

// ── Problem lookup map ────────────────────────────────────────────────────
// Usage: PROBLEM_MAP[task.problemId]  → full Problem object
// In production: GET /api/problems/:id  replaces this lookup.
// Populated after DUMMY_PROBLEMS is defined (see below).
export let PROBLEM_MAP = {}; // filled after DUMMY_PROBLEMS declaration

// ── Teacher's problem bank ─────────────────────────────────────────────────
// In production: GET /api/problems?owner=me
export const DUMMY_PROBLEMS = [
    {
        id: 'prob-1', title: 'Sorting Algorithm', difficulty: 'medium', author: 'Danny Casimero', createdAt: 'Feb 10, 2026',
        description: 'Given an array of integers nums, sort the array in ascending order and return it. You must solve the problem without using any built-in functions in O(nlog(n)) time complexity.',
        constraints: ['1 ≤ nums.length ≤ 5 × 10⁴', '-5 × 10⁴ ≤ nums[i] ≤ 5 × 10⁴'],
        sampleTestcases: [{ input: 'nums = [5,2,3,1]', expected: '[1,2,3,5]' }, { input: 'nums = [5,1,1,2,0,0]', expected: '[0,0,1,1,2,5]' }, { input: 'nums = [0]', expected: '[0]' }],
        hiddenTestcases: [{ input: 'nums = [-1,-3,2,0]', expected: '[-3,-1,0,2]' }, { input: 'nums = [100,99,98]', expected: '[98,99,100]' }],
    },
    {
        id: 'prob-2', title: 'Two Sum', difficulty: 'easy', author: 'Danny Casimero', createdAt: 'Feb 13, 2026',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
        constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', '-10⁹ ≤ target ≤ 10⁹', 'Only one valid answer exists.'],
        sampleTestcases: [{ input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' }, { input: 'nums = [3,2,4], target = 6', expected: '[1,2]' }, { input: 'nums = [3,3], target = 6', expected: '[0,1]' }],
        hiddenTestcases: [{ input: 'nums = [-1,-2,-3,-4,-5], target = -8', expected: '[2,4]' }, { input: 'nums = [0,4,3,0], target = 0', expected: '[0,3]' }, { input: 'nums = [1,5,1,5], target = 10', expected: '[1,3]' }],
    },
    {
        id: 'prob-3', title: 'Logic Gates', difficulty: 'easy', author: 'Danny Casimero', createdAt: 'Feb 20, 2026',
        description: 'Implement the basic logic gates (AND, OR, NOT, XOR) using Java. Each gate should accept boolean inputs and return the correct boolean output.',
        constraints: ['Inputs are strictly boolean (true/false)', 'NOT gate takes only one input'],
        sampleTestcases: [{ input: 'AND true true', expected: 'true' }, { input: 'OR false true', expected: 'true' }],
        hiddenTestcases: [{ input: 'XOR true true', expected: 'false' }],
    },
    {
        id: 'prob-4', title: 'Binary Search', difficulty: 'medium', author: 'GreyToRed', createdAt: 'Mar 05, 2026',
        description: 'Given a sorted array of integers and a target value, return the index of the target using binary search. If the target is not found, return -1.',
        constraints: ['1 ≤ nums.length ≤ 10⁴', 'All values in nums are unique', 'nums is sorted in ascending order'],
        sampleTestcases: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', expected: '4' }, { input: 'nums = [-1,0,3,5,9,12], target = 2', expected: '-1' }, { input: 'nums = [5], target = 5', expected: '0' }, { input: 'nums = [5], target = 3', expected: '-1' }],
        hiddenTestcases: [{ input: 'nums = [1,2,3,4,5,6,7,8,9,10], target = 7', expected: '6' }, { input: 'nums = [2,4,6,8], target = 5', expected: '-1' }, { input: 'nums = [-5,-3,-1,0,2], target = -3', expected: '1' }],
    },
    {
        id: 'prob-5', title: 'Linked List Reversal', difficulty: 'hard', author: 'Danny Casimero', createdAt: 'Mar 12, 2026',
        description: 'Given the head of a singly linked list, reverse the list in-place and return the new head.',
        constraints: ['The number of nodes in the list is in the range [0, 5000]', '-5000 ≤ Node.val ≤ 5000'],
        sampleTestcases: [{ input: 'head = [1,2,3,4,5]', expected: '[5,4,3,2,1]' }, { input: 'head = [1,2]', expected: '[2,1]' }, { input: 'head = []', expected: '[]' }],
        hiddenTestcases: [{ input: 'head = [1]', expected: '[1]' }, { input: 'head = [1,2,3]', expected: '[3,2,1]' }],
    },
    {
        id: 'prob-6', title: 'Quantum Computing', difficulty: 'hard', author: 'Danny Casimero', createdAt: 'Mar 20, 2026',
        description: 'Simulate a basic quantum gate operation on a qubit represented as a 2-element complex vector. Apply the given gate matrix and return the resulting state.',
        constraints: ['Gate matrices are 2×2', 'Qubit state vectors are normalized', 'Use double precision for calculations'],
        sampleTestcases: [{ input: 'gate = X, state = [1,0]', expected: '[0,1]' }, { input: 'gate = H, state = [1,0]', expected: '[0.707,0.707]' }],
        hiddenTestcases: [{ input: 'gate = Z, state = [0,1]', expected: '[0,-1]' }, { input: 'gate = X, state = [0,1]', expected: '[1,0]' }],
    },
];
// Populate the lookup map immediately after declaration
// In production this is replaced by: GET /api/problems/:id
DUMMY_PROBLEMS.forEach(p => { PROBLEM_MAP[p.id] = p; });

// ── Public problem pool (Explore view) ────────────────────────────────────
// In production: GET /api/problems?visibility=public
// Problems that exist in DUMMY_PROBLEMS are referenced directly (no duplication).
// Public-only stubs (pub-*) carry only summary fields needed by the Explore card.
export const DUMMY_PUBLIC_PROBLEMS = [
    // ── From teacher's bank (full data already in PROBLEM_MAP) ──
    DUMMY_PROBLEMS.find(p => p.id === 'prob-2'),  // Two Sum          — easy
    DUMMY_PROBLEMS.find(p => p.id === 'prob-1'),  // Sorting Algorithm — medium
    DUMMY_PROBLEMS.find(p => p.id === 'prob-4'),  // Binary Search     — medium
    DUMMY_PROBLEMS.find(p => p.id === 'prob-5'),  // Linked List Reversal — hard
    // ── Public-only problems (not in teacher's bank) ────────────
    { id: 'pub-t1', title: 'Triangle', difficulty: 'easy', author: 'Danny Casimero', description: 'Given three integers a, b, c representing side lengths, determine if they can form a valid triangle.' },
    { id: 'pub-m1', title: 'Modulus', difficulty: 'easy', author: 'Danny Casimero', description: 'Given two integers a and b, return a mod b. Handle edge cases where b is zero.' },
    { id: 'pub-h1', title: 'Graph Traversal', difficulty: 'hard', author: 'GreyToRed', description: 'Given an adjacency list representing a directed graph, implement BFS and DFS traversals.' },
    { id: 'pub-h2', title: 'Dynamic Programming', difficulty: 'hard', author: 'GreyToRed', description: 'Given an array of coin denominations and a target amount, return the minimum number of coins needed to make that amount.' },
];

// ── Sections (teacher view) ────────────────────────────────────────────────
// NOTE: 'unchecked' is NOT stored here — it is computed dynamically in App.jsx
//       by summing pending submissions across all tasks that belong to each section.
export const DUMMY_SECTIONS = [
    { id: 'BCS221-OCa', name: 'Fundamentals of Programming', status: 'active' },
    { id: 'BCS221-OCb', name: 'Fundamentals of Programming', status: 'active' },
    { id: 'MATH101-CS', name: 'Discrete Mathematics', status: 'archived' },
];

// ── Students per section ───────────────────────────────────────────────────
export const DUMMY_SECTION_STUDENTS = {
    'BCS221-OCa': [
        { id: 's1', name: 'John Michael Laureles', email: 'john.laureles@unc.edu.ph', studentId: '25-29019' },
        { id: 's2', name: 'Maria Elena Santos', email: 'maria.santos@unc.edu.ph', studentId: '25-29020' },
        { id: 's3', name: 'Robert James Cruz', email: 'robert.cruz@unc.edu.ph', studentId: '25-29021' },
        { id: 's4', name: 'Angela Rose Reyes', email: 'angela.reyes@unc.edu.ph', studentId: '25-29022' },
        { id: 's5', name: 'Mark Anthony dela Torre', email: 'mark.delatorre@unc.edu.ph', studentId: '25-29023' },
        { id: 's6', name: 'Christine Joy Mendoza', email: 'christine.mendoza@unc.edu.ph', studentId: '25-29024' },
        { id: 's7', name: 'Daniel Pio Ramos', email: 'daniel.ramos@unc.edu.ph', studentId: '25-29025' },
    ],
    'BCS221-OCb': [
        { id: 's8', name: 'Patricia Anne Villanueva', email: 'patricia.villanueva@unc.edu.ph', studentId: '25-29030' },
        { id: 's9', name: 'Joshua Emmanuel Lim', email: 'joshua.lim@unc.edu.ph', studentId: '25-29031' },
        { id: 's10', name: 'Sophia Marie Tan', email: 'sophia.tan@unc.edu.ph', studentId: '25-29032' },
        { id: 's11', name: 'Miguel Antonio Flores', email: 'miguel.flores@unc.edu.ph', studentId: '25-29033' },
        { id: 's12', name: 'Kristine Claire Ocampo', email: 'kristine.ocampo@unc.edu.ph', studentId: '25-29034' },
    ],
    'MATH101-CS': [
        { id: 's13', name: 'Aaron Kyle Bautista', email: 'aaron.bautista@unc.edu.ph', studentId: '25-29040' },
        { id: 's14', name: 'Lena Grace Pascual', email: 'lena.pascual@unc.edu.ph', studentId: '25-29041' },
        { id: 's15', name: 'Francis Jude Aguilar', email: 'francis.aguilar@unc.edu.ph', studentId: '25-29042' },
    ],
};

// ── Leaderboard fallback ───────────────────────────────────────────────────
// Derived at runtime from DUMMY_SUBMISSIONS via computeLeaderboard().
// In production: GET /api/tasks/:taskId/leaderboard
// Exported only so App.jsx can pass it as a safe empty-state fallback.
export const DUMMY_LEADERBOARD = computeLeaderboard(
    // Will be populated after DUMMY_SUBMISSIONS is declared (see below)
    // — replaced at module evaluation time
    []
);

/**
 * computeLeaderboard(submissions, currentStudentId?, maxScore?)
 *
 * Derives a ranked leaderboard from a submissions array.
 * - Filters out 'not_submitted' entries and null scores.
 * - Sorts by score descending, then by submitted_at ascending (earlier = higher).
 * - Marks the current student's row with isUser: true.
 * - Returns score as a display string "got/maxScore" for the UI.
 *
 * When the backend is ready, replace this with:
 *   GET /api/tasks/:taskId/leaderboard
 *
 * @param {Array}  submissions       — DUMMY_SUBMISSIONS[taskId]
 * @param {string} currentStudentId  — optional, marks the logged-in student’s row
 * @param {number} maxScore          — task’s max possible score (default 50)
 * @returns {Array} LeaderboardEntry[]
 */
export function computeLeaderboard(submissions = [], currentStudentId = null, maxScore = 50) {
    return submissions
        .filter(s => s.status !== 'not_submitted' && s.score != null)
        .map(s => ({ ...s, got: s.score }))          // score is now a plain integer
        .sort((a, b) => {
            // Sort by score % descending, then by submission time ascending
            const pctDiff = (b.got / maxScore) - (a.got / maxScore);
            if (pctDiff !== 0) return pctDiff;
            return new Date(a.time) - new Date(b.time);
        })
        .map((s, i) => ({
            rank:    i + 1,
            name:    s.name,
            time:    s.time,
            compile: s.compile,
            score:   `${s.got}/${maxScore}`,          // formatted display string
            isUser:  s.studentId === currentStudentId,
        }));
}

// ── Student submissions per task (teacher view) ────────────────────────────
// score:  INT | null  — earned points as a plain integer [0, task.maxScore].
//                       null means the submission has no grade yet.
//                       In production: TINYINT UNSIGNED NULL CHECK (score <= 50)
//                       Display: always render as `${score}/${task.maxScore}` in the UI.
// status: 'pending' | 'validated' | 'not_submitted'
export const DUMMY_SUBMISSIONS = {
    'task-1': [
        {
            studentId: 's1', name: 'John Michael Laureles', email: 'john.laureles@unc.edu.ph', score: 47, time: 'Feb 18, 09:14:02', compile: '1.84s', status: 'pending', code: `import java.util.*;
public class Solution {
    public static int[] sortArray(int[] nums) {
        Arrays.sort(nums);
        return nums;
    }
}` },
        {
            studentId: 's2', name: 'Maria Elena Santos', email: 'maria.santos@unc.edu.ph', score: 43, time: 'Feb 18, 10:02:11', compile: '2.01s', status: 'pending', code: `import java.util.*;
public class Solution {
    public static int[] sortArray(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - i - 1; j++)
                if (nums[j] > nums[j+1]) {
                    int t = nums[j]; nums[j] = nums[j+1]; nums[j+1] = t;
                }
        return nums;
    }
}` },
        {
            studentId: 's3', name: 'Robert James Cruz', email: 'robert.cruz@unc.edu.ph', score: 38, time: 'Feb 18, 11:45:33', compile: '2.55s', status: 'pending', code: `import java.util.*;
public class Solution {
    public static int[] sortArray(int[] nums) {
        // selection sort
        for (int i = 0; i < nums.length; i++) {
            int min = i;
            for (int j = i+1; j < nums.length; j++)
                if (nums[j] < nums[min]) min = j;
            int t = nums[i]; nums[i] = nums[min]; nums[min] = t;
        }
        return nums;
    }
}` },
        {
            studentId: 's4', name: 'Angela Rose Reyes', email: 'angela.reyes@unc.edu.ph', score: 50, time: 'Feb 17, 22:59:14', compile: '1.12s', status: 'validated', code: `import java.util.*;
public class Solution {
    public static int[] sortArray(int[] nums) {
        mergeSort(nums, 0, nums.length - 1);
        return nums;
    }
    static void mergeSort(int[] a, int l, int r) {
        if (l >= r) return;
        int m = (l + r) / 2;
        mergeSort(a, l, m);
        mergeSort(a, m+1, r);
        merge(a, l, m, r);
    }
    static void merge(int[] a, int l, int m, int r) {
        int[] tmp = Arrays.copyOfRange(a, l, r+1);
        int i = 0, j = m - l + 1, k = l;
        while (i <= m - l && j <= r - l) a[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];
        while (i <= m - l) a[k++] = tmp[i++];
        while (j <= r - l) a[k++] = tmp[j++];
    }
}` },
        {
            studentId: 's5', name: 'Mark Anthony dela Torre', email: 'mark.delatorre@unc.edu.ph', score: 29, time: 'Feb 19, 07:31:44', compile: '3.20s', status: 'validated', code: `import java.util.*;
public class Solution {
    public static int[] sortArray(int[] nums) {
        Arrays.sort(nums);
        return nums;
    }
}` },
        { studentId: 's6', name: 'Christine Joy Mendoza', email: 'christine.mendoza@unc.edu.ph', score: null, time: null, compile: null, status: 'not_submitted', code: null },
        { studentId: 's7', name: 'Daniel Pio Ramos', email: 'daniel.ramos@unc.edu.ph', score: null, time: null, compile: null, status: 'not_submitted', code: null },
    ],
    'task-2': [
        {
            studentId: 's1', name: 'John Michael Laureles', email: 'john.laureles@unc.edu.ph', score: 40, time: 'Feb 14, 19:49:14', compile: '2.16s', status: 'validated', code: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer,Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) return new int[]{map.get(comp), i};
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}` },
        {
            studentId: 's2', name: 'Maria Elena Santos', email: 'maria.santos@unc.edu.ph', score: 35, time: 'Feb 14, 20:15:00', compile: '1.90s', status: 'validated', code: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++)
            for (int j = i+1; j < nums.length; j++)
                if (nums[i] + nums[j] == target) return new int[]{i, j};
        return new int[]{};
    }
}` },
        {
            studentId: 's3', name: 'Robert James Cruz', email: 'robert.cruz@unc.edu.ph', score: 28, time: 'Feb 14, 21:00:22', compile: '2.40s', status: 'validated', code: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++)
            for (int j = i+1; j < nums.length; j++)
                if (nums[i] + nums[j] == target) return new int[]{i, j};
        return new int[]{};
    }
}` },
        { studentId: 's4', name: 'Angela Rose Reyes', email: 'angela.reyes@unc.edu.ph', score: null, time: null, compile: null, status: 'not_submitted', code: null },
        { studentId: 's5', name: 'Mark Anthony dela Torre', email: 'mark.delatorre@unc.edu.ph', score: null, time: null, compile: null, status: 'not_submitted', code: null },
    ],
    'task-3': [
        { studentId: 's13', name: 'Aaron Kyle Bautista', email: 'aaron.bautista@unc.edu.ph', score: 28, time: 'Feb 25, 14:22:10', compile: '1.44s', status: 'validated', code: `public class LogicGates {\n    public static boolean AND(boolean a, boolean b) { return a && b; }\n    public static boolean OR(boolean a, boolean b)  { return a || b; }\n    public static boolean NOT(boolean a)             { return !a; }\n}` },
        { studentId: 's14', name: 'Lena Grace Pascual', email: 'lena.pascual@unc.edu.ph', score: 25, time: 'Feb 26, 09:05:33', compile: '1.67s', status: 'validated', code: `public class LogicGates {\n    public static boolean AND(boolean a, boolean b) { return a & b; }\n    public static boolean OR(boolean a, boolean b)  { return a | b; }\n    public static boolean NOT(boolean a)             { return !a; }\n}` },
        { studentId: 's15', name: 'Francis Jude Aguilar', email: 'francis.aguilar@unc.edu.ph', score: null, time: null, compile: null, status: 'not_submitted', code: null },
    ],
};
