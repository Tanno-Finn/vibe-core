import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveFilterChipsComponent, ActiveFilterChip } from './active-filter-chips.component';

describe('ActiveFilterChipsComponent', () => {
  let fixture: ComponentFixture<ActiveFilterChipsComponent>;
  let component: ActiveFilterChipsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveFilterChipsComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ActiveFilterChipsComponent);
    component = fixture.componentInstance;
  });

  function setChips(chips: ActiveFilterChip[]): void {
    fixture.componentRef.setInput('chips', chips);
    fixture.detectChanges();
  }

  it('renders nothing when there are no active filters', () => {
    setChips([]);
    expect(fixture.nativeElement.querySelector('.active-filter-chips')).toBeNull();
  });

  it('renders one chip per entry, showing each label', () => {
    setChips([
      { key: 'word:0', label: 'neural', icon: 'pi pi-search', removeAriaLabel: 'Remove neural' },
      { key: 'category', label: 'ML', icon: 'pi pi-tag', removeAriaLabel: 'Remove ML' },
    ]);
    expect(fixture.nativeElement.querySelectorAll('.afc-chip').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('neural');
    expect(fixture.nativeElement.textContent).toContain('ML');
  });

  it('exposes a per-chip remove aria-label', () => {
    setChips([{ key: 'a', label: 'Alpha', icon: 'pi pi-search', removeAriaLabel: 'Remove filter: Alpha' }]);
    const btn = fixture.nativeElement.querySelector('.afc-chip__remove') as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('Remove filter: Alpha');
  });

  it('emits the chip key when its × is clicked', () => {
    setChips([{ key: 'category', label: 'ML', icon: 'pi pi-tag', removeAriaLabel: 'Remove ML' }]);
    let emitted: string | undefined;
    component.remove.subscribe((k: string) => (emitted = k));
    (fixture.nativeElement.querySelector('.afc-chip__remove') as HTMLButtonElement).click();
    expect(emitted).toBe('category');
  });

  it('applies the accessible group label', () => {
    fixture.componentRef.setInput('groupLabel', 'Active filters');
    setChips([{ key: 'a', label: 'Alpha', icon: 'pi pi-search', removeAriaLabel: 'x' }]);
    const group = fixture.nativeElement.querySelector('.active-filter-chips') as HTMLElement;
    expect(group.getAttribute('aria-label')).toBe('Active filters');
  });
});
