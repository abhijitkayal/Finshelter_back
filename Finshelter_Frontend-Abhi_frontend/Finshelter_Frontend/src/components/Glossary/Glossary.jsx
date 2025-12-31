import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Tabs,
  Tab,
  Card,
  CardContent,
  useMediaQuery,
  Drawer,
  IconButton,
  Breadcrumbs,
  Link,
  InputAdornment,
  TextField,
  Button
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { NavLink } from 'react-router-dom';
import './Glossary.css';

// Glossary data organized by letter
const glossaryData = {
  A: [
    { title: 'Assessment Year (AY)', content: 'The year following the financial year in which income is earned. Income earned during a financial year is assessed for tax in the immediately following assessment year.' },
    { title: 'Assessment', content: 'The process by which the Income Tax Department evaluates the income tax return of a taxpayer and determines the tax liability.' },
    { title: 'Annual Value', content: 'The value of a property that is considered for the purpose of calculating income from house property. It is usually the rent received or receivable.' },
    { title: 'Annual Information Return (AIR)', content: 'A return that specified entities are required to file, providing details of high-value financial transactions.' },
    { title: 'Alternate Minimum Tax (AMT)', content: 'A minimum tax imposed on certain taxpayers who have large deductions or exemptions, to ensure they pay at least a minimum amount of tax.' },
    { title: 'Annual Information Statement (AIS)', content: 'A comprehensive statement of financial transactions available to taxpayers, showing information that the tax department has about their transactions.' },
    { title: 'Advance Tax', content: 'Tax that is required to be paid in installments during the financial year in which the income is earned, rather than as a lump sum after the year ends.' },
    { title: 'Agricultural Income', content: 'Income derived from agricultural land, which is generally exempt from income tax under the Indian Income Tax Act.' },
    { title: 'Assessment Officer (AO)', content: 'The Income Tax Officer authorized to assess the income tax returns of taxpayers in a particular jurisdiction.' },
    { title: 'Advance Ruling', content: 'A determination issued in advance by the tax authorities regarding the tax consequences of a transaction or activity.' },
    { title: 'Assessment Order', content: 'An order issued by the Income Tax Department after processing the tax return, indicating the final tax liability.' },
    { title: 'Adjusted Gross Total Income (AGTI)', content: 'Gross total income after adjusting for certain deductions and losses.' },
    { title: 'Assessee', content: 'A person who is liable to pay tax or any other sum under the Income Tax Act.' },
    { title: 'Allowance', content: 'An amount paid to an employee to meet expenses related to his employment, which may be fully taxable, partially taxable, or fully exempt.' },
    { title: 'Assumption of Jurisdiction', content: 'The act by which an assessing officer takes up a case for scrutiny or assessment.' },
    { title: 'Agricultural Land', content: 'Land used for agricultural purposes, which is typically exempt from capital gains tax if it meets certain conditions.' },
    { title: 'Amnesty Scheme', content: 'A program offered by the government allowing taxpayers to disclose previously undeclared income or assets without facing severe penalties.' }
  ],
  B: [
    { title: 'Best Judgment Assessment', content: 'Assessment made by the tax officer based on their best judgment when a taxpayer fails to file a return or provide required information.' },
    { title: 'Business Income', content: 'Income earned from carrying on a business or profession, which is taxable under the head "Profits and Gains of Business or Profession".' },
    { title: 'Business Loss', content: 'A loss incurred in the course of doing business, which can generally be set off against other income or carried forward to future years.' },
    { title: 'Bonus', content: 'Additional compensation paid to an employee, usually based on performance or company profits, which is taxable as salary income.' },
    { title: 'Business Entity', content: 'An organization that conducts business, such as a sole proprietorship, partnership, corporation, or limited liability company.' },
    { title: 'Basic Salary', content: 'The core component of an employee\'s compensation package, excluding allowances and other benefits, which is fully taxable.' },
    { title: 'Balance Sheet', content: 'A financial statement that shows a company\'s assets, liabilities, and equity at a specific point in time.' },
    { title: 'Banking Cash Transaction Tax (BCTT)', content: 'A tax previously levied on cash withdrawals exceeding certain limits from bank accounts.' },
    { title: 'Book Profit', content: 'Profit calculated according to accounting standards, used for calculating Minimum Alternate Tax (MAT).' },
    { title: 'Beneficiary Tax', content: 'Tax liability that falls on the beneficiary of income rather than the entity generating it.' },
    { title: 'Black Money', content: 'Undisclosed income on which taxes have not been paid.' },
    { title: 'Beneficial Owner', content: 'The person who ultimately owns or controls an asset, even if it is legally owned by someone else.' },
    { title: 'Business Expenditure', content: 'Expenses incurred wholly and exclusively for business purposes, which are generally deductible from business income.' },
    { title: 'Business Deductions', content: 'Expenses that can be subtracted from business income to reduce the taxable income.' }
  ],
  C: [
    { title: 'Compounding of an Offence', content: 'A provision that allows a taxpayer to pay a specified amount to avoid prosecution for certain tax offenses.' },
    { title: 'Computation of Income', content: 'The process of calculating taxable income by applying various provisions of tax laws.' },
    { title: 'Charitable Contributions', content: 'Donations made to qualified charitable organizations, which may qualify for tax deductions.' },
    { title: 'Capital Asset', content: 'Property of any kind held by a person, whether or not connected with their business or profession.' },
    { title: 'Commodity Transaction Tax (CTT)', content: 'A tax levied on transactions done on domestic commodity derivatives exchanges.' },
    { title: 'Capital Gains Tax', content: 'Tax imposed on profits realized from the sale of assets like stocks, bonds, or real estate.' },
    { title: 'Centralized Processing Centre (CPC)', content: 'A facility of the Income Tax Department for processing income tax returns.' },
    { title: 'Capital Gains', content: 'Profit realized from the sale of a capital asset.' },
    { title: 'Capital Expenditure', content: 'Money spent to acquire, maintain, or improve capital assets like property, equipment, or infrastructure.' },
    { title: 'Central Board of Direct Taxes (CBDT)', content: 'The apex body of the Income Tax Department, responsible for administering direct tax laws.' },
    { title: 'Capital Loss', content: 'Loss incurred from the sale of a capital asset for less than its purchase price.' },
    { title: 'Collection and Recovery of Tax', content: 'The process by which tax authorities collect taxes due from taxpayers.' },
    { title: 'Cost Inflation Index (CII)', content: 'An index used to calculate inflation-adjusted cost of acquisition for capital gains tax purposes.' },
    { title: 'Contingent Liability', content: 'A potential liability that may occur depending on the outcome of an uncertain future event.' },
    { title: 'Charitable Trust', content: 'A trust established for charitable purposes, which may qualify for certain tax exemptions.' },
    { title: 'Clubbing of Income', content: 'The inclusion of income of one person in the income of another person for tax purposes under certain circumstances.' },
    { title: 'Capital Receipts', content: 'Money received from the sale of capital assets or as investment in a business.' },
    { title: 'Cooperative Society', content: 'An autonomous association of persons united voluntarily to meet their common economic, social, and cultural needs through a jointly-owned enterprise.' },
    { title: 'Carry Forward and Set Off of Losses', content: 'The ability to offset current or future income with losses from previous years, subject to certain conditions.' }
  ],
  // Additional letters would follow the same format
};

// Styled components
const SidebarWrapper = styled(Paper)(({ theme }) => ({
  height: '100%',
  backgroundColor: '#f5f8f6',
  borderRadius: 0,
  boxShadow: 'none',
  border: 'none',
  borderRight: '1px solid #e0e0e0',
  overflow: 'hidden',
  position: 'sticky',
  top: 128,
  maxHeight: 'calc(100vh - 128px)',
  overflowY: 'auto',
}));

const ContentWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '8px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
  backgroundColor: '#ffffff',
  marginBottom: theme.spacing(3),
}));

const GlossaryTitle = styled(Typography)(({ theme }) => ({
  color: '#1b321d',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  borderBottom: '2px solid #95b8a2',
  display: 'inline-block',
}));

const GlossaryContent = styled(Typography)(({ theme }) => ({
  color: '#333',
  lineHeight: 1.6,
}));

const AlphabetTab = styled(Tab)(({ theme }) => ({
  minWidth: 'auto',
  padding: '6px 10px',
  color: '#1b321d',
  fontWeight: 600,
  '&.Mui-selected': {
    color: '#fff',
    backgroundColor: '#1b321d',
    borderRadius: '4px',
  },
}));

const AlphabetTabs = styled(Tabs)(({ theme }) => ({
  minHeight: '36px',
  marginBottom: theme.spacing(2),
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#1b321d',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1b321d',
  },
}));

const GlossaryPage = () => {
  const [currentLetter, setCurrentLetter] = useState('A');
  const [selectedTerm, setSelectedTerm] = useState(glossaryData['A'][0].title);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // Get all letters from the glossary data
  const letters = Object.keys(glossaryData);

  // Handle letter change
  const handleLetterChange = (event, newValue) => {
    setCurrentLetter(newValue);
    setSelectedTerm(glossaryData[newValue][0].title);
  };

  // Handle term selection
  const handleTermClick = (term) => {
    setSelectedTerm(term);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter terms based on search
  const filteredTerms = searchTerm 
    ? glossaryData[currentLetter].filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : glossaryData[currentLetter];

  // Get the selected term's content
  const selectedTermContent = glossaryData[currentLetter].find(
    item => item.title === selectedTerm
  )?.content || '';

  // Render sidebar content
  const sidebarContent = (
    <>
      <Box p={2} bgcolor="#1b321d" color="white">
        <Typography variant="h6" fontWeight="bold">
          Tax Glossary
        </Typography>
        <Typography variant="body2">
          Browse tax terms and definitions
        </Typography>
      </Box>
      
      <Box p={2}>
        <SearchTextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search terms..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        
        <AlphabetTabs
          value={currentLetter}
          onChange={handleLetterChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="alphabet tabs"
        >
          {letters.map((letter) => (
            <AlphabetTab key={letter} label={letter} value={letter} />
          ))}
        </AlphabetTabs>
        
        <List sx={{ pt: 0 }}>
          {filteredTerms.map((item) => (
            <ListItem key={item.title} disablePadding divider>
              <ListItemButton
                selected={selectedTerm === item.title}
                onClick={() => handleTermClick(item.title)}
                sx={{
                  borderLeft: selectedTerm === item.title ? '4px solid #1b321d' : 'none',
                  backgroundColor: selectedTerm === item.title ? 'rgba(149, 184, 162, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(149, 184, 162, 0.2)',
                  },
                }}
              >
                <ListItemText 
                  primary={item.title} 
                  primaryTypographyProps={{ 
                    fontWeight: selectedTerm === item.title ? 600 : 400,
                    color: selectedTerm === item.title ? '#1b321d' : 'inherit',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <Box className="glossary-container" sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', pt: 16, pb: 8 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Link component={NavLink} to="/" color="inherit">
            Home
          </Link>
          <Link component={NavLink} to="/resources" color="inherit">
            Resources
          </Link>
          <Typography color="text.primary">Tax Glossary</Typography>
        </Breadcrumbs>

        {/* Page Title */}
        <Box mb={4} textAlign={isSmall ? 'center' : 'left'}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="#1b321d">
            Tax Glossary
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Comprehensive definitions of tax terms to help you understand taxation better
          </Typography>
        </Box>

        {/* Mobile View - Toggle Sidebar */}
        {isMobile && (
          <Box mb={2}>
            <Button
              variant="outlined"
              startIcon={<MenuIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{ 
                borderColor: '#1b321d', 
                color: '#1b321d',
                '&:hover': {
                  borderColor: '#1b321d',
                  backgroundColor: 'rgba(27, 50, 29, 0.04)',
                }
              }}
            >
              Browse Terms
            </Button>
          </Box>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box sx={{ width: 280 }}>
              {sidebarContent}
            </Box>
          </Drawer>
        )}

        {/* Desktop Layout */}
        <Grid container spacing={3}>
          {/* Sidebar - Desktop */}
          {!isMobile && (
            <Grid item md={4} lg={3}>
              <SidebarWrapper>
                {sidebarContent}
              </SidebarWrapper>
            </Grid>
          )}

          {/* Main Content */}
          <Grid item xs={12} md={8} lg={9}>
            <ContentWrapper>
              <Box mb={3}>
                <GlossaryTitle variant="h5">
                  {selectedTerm}
                </GlossaryTitle>
              </Box>
              <GlossaryContent variant="body1">
                {selectedTermContent}
              </GlossaryContent>
            </ContentWrapper>

            {/* Related Terms */}
            <Box mb={3}>
              <Typography variant="h6" color="#1b321d" fontWeight="600" mb={2}>
                Other Terms in {currentLetter}
              </Typography>
              <Grid container spacing={2}>
                {glossaryData[currentLetter]
                  .filter(item => item.title !== selectedTerm)
                  .slice(0, 4)
                  .map((item) => (
                    <Grid item xs={12} sm={6} key={item.title}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          }
                        }}
                        onClick={() => handleTermClick(item.title)}
                      >
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="600" color="#1b321d">
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {item.content}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>

            {/* Letter Navigation */}
            <Paper sx={{ p: 2, borderRadius: '8px' }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Browse by Letter
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {letters.map((letter) => (
                  <Box 
                    key={letter}
                    sx={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      backgroundColor: currentLetter === letter ? '#1b321d' : '#f5f8f6',
                      color: currentLetter === letter ? 'white' : '#1b321d',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: currentLetter === letter ? '#1b321d' : '#e0e0e0',
                      }
                    }}
                    onClick={() => {
                      setCurrentLetter(letter);
                      setSelectedTerm(glossaryData[letter][0].title);
                    }}
                  >
                    {letter}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default GlossaryPage; 