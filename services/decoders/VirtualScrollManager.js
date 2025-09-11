// VirtualScrollManager - Handle large log datasets efficiently
class VirtualScrollManager {
  static usePagination(items, pageSize = 100) {
    try {
      const [currentPage, setCurrentPage] = React.useState(0);
      
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const startIndex = currentPage * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);
      const currentItems = items.slice(startIndex, endIndex);
      
      return {
        items: currentItems,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        startIndex,
        endIndex,
        enablePagination: totalItems > pageSize
      };
    } catch (error) {
      console.error('VirtualScrollManager pagination error:', error);
      reportError(error);
      return {
        items: items.slice(0, 100),
        currentPage: 0,
        setCurrentPage: () => {},
        totalPages: 1,
        totalItems: items.length,
        startIndex: 0,
        endIndex: Math.min(100, items.length),
        enablePagination: false
      };
    }
  }
  
  static useVirtualScroll(items, containerRef, itemHeight = 35, enabled = false) {
    try {
      const [scrollTop, setScrollTop] = React.useState(0);
      const [containerHeight, setContainerHeight] = React.useState(0);
      
      React.useEffect(() => {
        const container = containerRef.current;
        if (!container || !enabled) return;
        
        const handleScroll = () => setScrollTop(container.scrollTop);
        const handleResize = () => setContainerHeight(container.clientHeight);
        
        container.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        handleResize();
        
        return () => {
          container.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleResize);
        };
      }, [containerRef, enabled]);
      
      if (!enabled) {
        return {
          isVirtualized: false,
          visibleItems: items,
          startIndex: 0,
          endIndex: items.length
        };
      }
      
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
      );
      
      return {
        isVirtualized: true,
        visibleItems: items.slice(startIndex, endIndex),
        startIndex,
        endIndex,
        totalHeight: items.length * itemHeight,
        offsetY: startIndex * itemHeight
      };
    } catch (error) {
      console.error('VirtualScrollManager virtual scroll error:', error);
      reportError(error);
      return {
        isVirtualized: false,
        visibleItems: items.slice(0, 100),
        startIndex: 0,
        endIndex: Math.min(100, items.length)
      };
    }
  }
  
  static renderVirtualList(items, renderItem, virtualScroll) {
    try {
      if (!virtualScroll.isVirtualized) {
        return {
          containerStyle: {},
          contentStyle: {},
          visibleItems: items.map((item, index) => renderItem(item, index))
        };
      }
      
      const containerStyle = {
        height: virtualScroll.totalHeight,
        position: 'relative'
      };
      
      const contentStyle = {
        transform: `translateY(${virtualScroll.offsetY}px)`
      };
      
      const visibleItems = virtualScroll.visibleItems.map((item, index) =>
        renderItem(item, virtualScroll.startIndex + index)
      );
      
      return {
        containerStyle,
        contentStyle,
        visibleItems
      };
    } catch (error) {
      console.error('VirtualScrollManager render error:', error);
      reportError(error);
      return {
        containerStyle: {},
        contentStyle: {},
        visibleItems: items.slice(0, 50).map((item, index) => renderItem(item, index))
      };
    }
  }
}

// Export VirtualScrollManager
window.VirtualScrollManager = VirtualScrollManager;
