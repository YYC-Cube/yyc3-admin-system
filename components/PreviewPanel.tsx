'use client';

import { Search, Filter, Undo, Redo, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useState } from 'react';

import { TableView } from './TableView';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';
import { useTableSelection } from '@/hooks/useTableSelection';

interface PreviewPanelProps {
  tableData: string[][];
  setTableData: (data: string[][]) => void;
  updateInputData: (data: string[][]) => string;
  saveToHistory: (tableData: string[][], inputData: string) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  historyIndex: number;
  historyLength: number;
  isTableExpanded: boolean;
  onTableExpand: () => void;
  inputData: string;
  selectedFormat: string;
  parseInputData: (data: string, format: string) => string[][];
}

export const PreviewPanel = ({
  tableData,
  setTableData,
  updateInputData,
  saveToHistory,
  handleUndo,
  handleRedo,
  historyIndex,
  historyLength,
  isTableExpanded,
  onTableExpand,
  inputData,
  selectedFormat,
  parseInputData,
}: PreviewPanelProps) => {
  const [filterText, setFilterText] = useState('');
  const [tableScale, setTableScale] = useState(1);
  const { getSelectedCellsInfo } = useTableSelection();
  const { t } = useLanguage();

  const handleTableZoomIn = () => {
    setTableScale((prev) => Math.min(prev + 0.2, 2.0));
  };

  const handleTableZoomOut = () => {
    setTableScale((prev) => Math.max(prev - 0.2, 0.6));
  };

  const filteredData = tableData.filter((row) =>
    row.some((cell) => cell.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('placeholders.filter')}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-10 bg-card border-border focus:border-ring focus:ring-ring rounded-lg"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground border-0 hover:from-primary/90 hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Filter className="w-4 h-4 mr-2" />
          {t('buttons.filter')}
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground border-0 hover:from-primary/90 hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            <Undo className="w-4 h-4 mr-2" />
            {t('buttons.undo')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={historyIndex >= historyLength - 1}
            className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground border-0 hover:from-primary/90 hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            <Redo className="w-4 h-4 mr-2" />
            {t('buttons.redo')}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder={t('placeholders.search')}
            className="pl-9 bg-card border border-border focus:border-ring focus:ring-ring rounded-lg"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground border-0 hover:from-primary/90 hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-200">
            {t('actions.refresh')}
          </Button>
          <Button variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80">
            {t('actions.reset')}
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {getSelectedCellsInfo()}
          </div>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTableZoomOut}
              disabled={tableScale <= 0.6}
              className="bg-linear-to-r from-indigo-500 to-indigo-600 text-white border-0 hover:from-indigo-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTableZoomIn}
              disabled={tableScale >= 2.0}
              className="bg-linear-to-r from-indigo-500 to-indigo-600 text-white border-0 hover:from-indigo-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onTableExpand}
              className="bg-linear-to-r from-indigo-500 to-indigo-600 text-white border-0 hover:from-indigo-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {filteredData.length > 0 && (
        <TableView
          filteredData={filteredData}
          tableData={tableData}
          setTableData={setTableData}
          updateInputData={updateInputData}
          saveToHistory={saveToHistory}
          tableScale={tableScale}
          isTableExpanded={isTableExpanded}
          inputData={inputData}
          selectedFormat={selectedFormat}
          parseInputData={parseInputData}
        />
      )}
    </>
  );
};
