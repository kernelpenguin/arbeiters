import { Component, signal, computed, linkedSignal, resource } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Opportunity {
  platform: string;
  title: string;
  category: string;
  wage: number;
  type: string;
  skills: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'landing-page';
  historicoTexto = '{ 1886 // 1917 // 2026 }';

  // --- Design System / Config ---
  allSkills = [
    'Coding', 
    'RLHF', 
    'STEM/Math', 
    'Creative Writing', 
    'Translation', 
    'Prompt Engineering', 
    'Red-teaming', 
    'Evaluation'
  ];

  categories = ['All', 'Coding', 'RLHF', 'STEM/Math', 'Creative Writing', 'Translation', 'Red-teaming'];

  private readonly mockOpportunities: Opportunity[] = [
    {
      platform: 'Outlier',
      title: 'Coding Expert - Python/C++',
      category: 'Coding',
      wage: 55.00,
      type: 'PROJECT',
      skills: ['Coding']
    },
    {
      platform: 'DataAnnotation',
      title: 'RLHF Math Solver & Explainer',
      category: 'STEM/Math',
      wage: 42.50,
      type: 'BATCH',
      skills: ['STEM/Math', 'RLHF']
    },
    {
      platform: 'Surge AI',
      title: 'LLM Safety & Jailbreaking',
      category: 'Red-teaming',
      wage: 38.00,
      type: 'TASK',
      skills: ['Red-teaming', 'Prompt Engineering']
    },
    {
      platform: 'Alignerr',
      title: 'Creative Writer & Essay Grader',
      category: 'Creative Writing',
      wage: 30.00,
      type: 'BATCH',
      skills: ['Creative Writing']
    },
    {
      platform: 'Outlier',
      title: 'AI Code Reviewer - Senior',
      category: 'Coding',
      wage: 65.00,
      type: 'PROJECT',
      skills: ['Coding', 'Evaluation']
    },
    {
      platform: 'DataAnnotation',
      title: 'German/English Translation Specialist',
      category: 'Translation',
      wage: 28.00,
      type: 'TASK',
      skills: ['Translation']
    },
    {
      platform: 'Surge AI',
      title: 'Music & Audio Multimodal Labeling',
      category: 'RLHF',
      wage: 24.00,
      type: 'TASK',
      skills: ['RLHF']
    }
  ];

  // --- Reactive State (Signals) ---
  userSkills = signal<string[]>(['Coding', 'Evaluation', 'RLHF']);
  selectedCategory = signal<string>('All');

  // --- Writable State Dependent on Category (linkedSignal) ---
  // Defaults to a baseline wage depending on the selected category,
  // but can be freely overriden by the user via the UI slider.
  minWagePreferred = linkedSignal<string, number>({
    source: () => this.selectedCategory(),
    computation: (cat) => {
      if (cat === 'Coding') return 45;
      if (cat === 'STEM/Math') return 35;
      if (cat === 'Red-teaming') return 30;
      return 25; // default
    }
  });

  // --- Async Data Fetching simulation (resource) ---
  opportunitiesResource = resource({
    params: () => ({ category: this.selectedCategory() }),
    loader: async ({ params }) => {
      // Simulate API call delay to show loading state in true modern Angular fashion
      await new Promise(resolve => setTimeout(resolve, 250));
      return this.mockOpportunities.filter(
        o => params.category === 'All' || o.category === params.category
      );
    }
  });

  // --- Derived State (computed) ---
  filteredOpportunities = computed(() => {
    const opportunities = this.opportunitiesResource.value() || [];
    const skills = this.userSkills();
    const minWage = this.minWagePreferred();

    return opportunities.map(o => {
      // RN02 - Match Score Calculation (50% skills match, 50% wage match)
      let skillScore = 0;
      if (o.skills.length > 0) {
        const matchingSkills = o.skills.filter(s => skills.includes(s));
        skillScore = (matchingSkills.length / o.skills.length) * 100;
      } else {
        skillScore = 100; // Free match if no skills specified
      }

      let wageScore = 100;
      if (o.wage < minWage) {
        // Wage match decays linearly as it goes below preference
        wageScore = Math.max(0, 100 - (minWage - o.wage) * 4);
      }

      const score = Math.round((skillScore * 0.5) + (wageScore * 0.5));
      return { ...o, matchScore: score };
    }).sort((a, b) => b.matchScore - a.matchScore);
  });

  // --- Statistics (computed) ---
  totalOpportunities = computed(() => this.opportunitiesResource.value()?.length || 0);
  
  avgWage = computed(() => {
    const opps = this.opportunitiesResource.value() || [];
    if (opps.length === 0) return 0;
    return Math.round(opps.reduce((acc, curr) => acc + curr.wage, 0) / opps.length);
  });

  perfectMatchesCount = computed(() => {
    return this.filteredOpportunities().filter(o => o.matchScore >= 80).length;
  });

  // --- User Interactions ---
  toggleSkill(skill: string) {
    this.userSkills.update(skills => 
      skills.includes(skill) 
        ? skills.filter(s => s !== skill) 
        : [...skills, skill]
    );
  }

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  updateWage(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.minWagePreferred.set(Number(value));
  }
}
