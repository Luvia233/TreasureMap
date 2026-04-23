# TabBar Icons

This folder should contain the following PNG icons for the TabBar:

| File | Size | Description |
|------|------|-------------|
| home.png | 81x81px | Home tab icon (unselected) |
| home-active.png | 81x81px | Home tab icon (selected) |
| search.png | 81x81px | Search tab icon (unselected) |
| search-active.png | 81x81px | Search tab icon (selected) |
| add.png | 81x81px | Add tab icon (unselected) |
| add-active.png | 81x81px | Add tab icon (selected) |
| family.png | 81x81px | Family tab icon (unselected) |
| family-active.png | 81x81px | Family tab icon (selected) |

## Icon Requirements

- Format: PNG (recommended) or JPG
- Size: 81x81 pixels (recommended) or proportional scaling
- Maximum file size: 40KB per icon
- The icons should have transparent backgrounds

## Quick Placeholder Solution

If you don't have icons yet, you can temporarily remove the iconPath properties from app.json:

```json
"list": [
  {
    "pagePath": "pages/index/index",
    "text": "首页"
  },
  {
    "pagePath": "pages/search/search",
    "text": "搜索"
  },
  {
    "pagePath": "pages/add/add",
    "text": "添加"
  },
  {
    "pagePath": "pages/family/family",
    "text": "家庭"
  }
]
```

This will show text-only tabs without icons.
