import {useEffect,useMemo,useRef,useState} from 'react';
import {
  SEARCH_CATEGORY_LABELS,
  searchWorkspace,
  type GlobalSearchHit,
  type GlobalSearchTarget,
  type SearchCategory,
  type SearchSources,
} from '../domain/global-search';

interface Props {
  open: boolean;
  sources: SearchSources;
  onClose: () => void;
  onSelect: (target: GlobalSearchTarget) => void;
}

const CATEGORIES: Array<SearchCategory | 'all'> = [
  'all',
  'tree',
  'goal',
  'material',
  'crafting',
  'syndicate',
  'relic',
  'worldstate',
];

const QUICK_TERMS = ['托里德', '毒囊双枪', '福马', '六人组', '伯斯顿', '夜灵平野'];

export function GlobalSearchModal({open, sources, onClose, onSelect}: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory | 'all'>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const hits = useMemo(
    () => (open ? searchWorkspace(query, sources, category, 36) : []),
    [open, query, sources, category],
  );

  const safeIndex = hits.length > 0 ? Math.min(activeIndex, hits.length - 1) : 0;

  if (!open) return null;

  function choose(hit: GlobalSearchHit) {
    onSelect(hit.target);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hits.length > 0) setActiveIndex(i => (i + 1) % hits.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hits.length > 0) setActiveIndex(i => (i - 1 + hits.length) % hits.length);
    } else if (e.key === 'Enter' && hits[safeIndex]) {
      e.preventDefault();
      choose(hits[safeIndex]);
    }
  }

  return (
    <div
      className="modal-scrim global-search-scrim"
      role="dialog"
      aria-modal="true"
      aria-label="全局跨模块搜索"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
      data-testid="global-search-modal"
    >
      <div className="panel global-search-dialog">
        <div className="global-search-head">
          <span className="global-search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            ref={inputRef}
            type="search"
            aria-label="全局搜索关键词"
            placeholder="搜科技树、战甲/武器、材料、制作、集团、虚空遗物或世界状态…"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            data-testid="global-search-input"
          />
          <button type="button" onClick={onClose} aria-label="关闭全局搜索">
            ✕
          </button>
        </div>

        <div className="global-search-cats" role="tablist" aria-label="搜索分类筛选">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              onClick={() => {
                setCategory(cat);
                setActiveIndex(0);
              }}
            >
              {cat === 'all' ? '全部' : SEARCH_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="global-search-body">
          {!query.trim() ? (
            <div className="global-search-empty">
              <p>输入中文名、英文名或遗物编号（支持空格多词组合，如“后纪”或“福马 蓝图”）。</p>
              <div className="chips">
                {QUICK_TERMS.map(term => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      setActiveIndex(0);
                      inputRef.current?.focus();
                    }}
                  >
                    试试：{term}
                  </button>
                ))}
              </div>
            </div>
          ) : hits.length === 0 ? (
            <p className="global-search-empty">
              未在当前收录目录与缓存中找到「{query.trim()}」。无结果不代表游戏不存在，可切换分类或同步 WFCD 世界状态后再查。
            </p>
          ) : (
            <ul className="global-search-results" role="listbox" aria-label="全局搜索结果">
              {hits.map((hit, idx) => (
                <li key={hit.uid}>
                  <button
                    type="button"
                    className={idx === safeIndex ? 'selected' : ''}
                    data-testid={'search-hit:' + hit.uid}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => choose(hit)}
                  >
                    <div className="hit-top">
                      <span className="hit-cat">{SEARCH_CATEGORY_LABELS[hit.category]}</span>
                      <span className="hit-badge">{hit.badge}</span>
                    </div>
                    <strong>{hit.title}</strong>
                    <small>{hit.subtitle}</small>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="global-search-foot">
          <span>↑↓ 选择 · Enter 直达 · Esc 关闭</span>
          <span>共匹配 {hits.length} 条</span>
        </div>
      </div>
    </div>
  );
}
