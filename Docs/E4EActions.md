## Explorer for Endevor Actions

Explorer for Endevor enables you to explore Endevor using custom filters. You can then inspect and retrieve elements from data sets to work with, before merging your changes with the data source.

### Filter Actions

Create Filters to further refine your search for elements in Explorer in Endevor.
The Type level allows you to create custom filters.
The created filters are derived from the properties of the specified element.
As such, they can be used, with wildcards, to identify other elements of similar characteristics.

#### Create Filter

Filters can be created in two ways. You can create a filter manually by entering all the required parameters, or you can search in Map View, and save a filter from the path you followed.

#### Create a Manual Filter:
You can create a manual filter if you know the exact parameters required.
#### Follow these steps:
1. Click the plus icon next to Filter on the Explorer for Endevor tab.
2. When prompted, enter the required parameters as follows:
    - Environment (env)
    - Stage Number (stgnum)
    - System (sys)
    - Subsystem (subsys)
    - Type (type)
    - Element (element)
  If the parameters (with a maximum of two parameters as * wildcards) are correctly entered, the filter will appear under the expanded Filter section in the Explorer for Endevor tab.

#### Create a Filter through Map View:
The Type level in Map View allows you to create custom filters, without necessarily knowing the parameters in advance.
#### Follow these steps:
1. Open Map View in Explorer for Endevor for your selected Host
2. Navigate the view as required, selecting your desired options as you navigate through the following stages:
    - Repository
    - Environment
    - Stage Number
    - System
    - Subsystem
    - Type
3. Select an entry at the Type level, and click the Add icon.
  The path that you followed appears highlighted at the top of your screen, displaying the following dialog:
4. Create a new Endevor filter (Press 'Enter' to confirm or 'Escape' to cancel)
5. If the created filter matches your requirements, Press Enter.
  The newly created filter is automatically saved and now shows as an option under the Filters View 

  Once created, you can then edit or delete the filter as required.

#### Edit Filter
You can edit existing filters to create custom searches for elements with closely matching characteristics elsewhere in the data set.
#### Follow these steps:
1. Select the filter that you want to edit. The filter is highlighted, and the following options are displayed:
```
 - Delete
 - Edit
```
2. Click the edit icon. A message shows with the instruction "Edit filter. (Press 'Enter' to confirm or 'Escape' to cancel)" and the selected filter highlighted with only the Element field as a Wildcard ( * ):
```
    ENVIRONMENT/STAGE NUMBER/SYSTEM/SUBSYSTEM/TYPE/*
```
3. Replace any field as required with a Wildcard ( * ), for example:
```
    ENVIRONMENT/STAGENUMBER/SYSTEM/SUBSYSTEM/*/*
```
  This filter could now be used, for example, to display all Types and Elements in the specified Subsystem
  
4. Press Enter to confirm the changes
  The filter has been edited and now shows under the list of saved filters.
The filters list automatically contains every filter that you have created and so it can get heavily populated if you are conducting several different searches. To address this, delete filters once they are no longer needed.

#### Notes:
```
    - Wildcard entries or specific data must be entered for every level when a filter is edited.
    - Filters with missing or empty fields are not permitted.
    - Filters that you create are automatically saved in the Filters View.
    - You can key several fields as wildcards, however ensure that you use no more than two wildcards in any filter.
    - If searching in a large volume of data using several wildcards can trigger large scale searches, with a negative impact on performance.
```
#### Delete Filter
The filters list automatically contains every filter that you have created and so it can get heavily populated if you are conducting several different searches. To address this, you can delete filters once they are no longer needed
#### Follow these steps:
1. Select the filter that you want to delete The filter is highlighted, and the following options are displayed:
    - Delete
    - Edit
2. Click the Delete icon.
A message shows as follows:
```
Delete filter: ENV1/1/(*)/(*)/(*)/(*)?
Source: Explorer for Endevor (Extension) 
```
3. Click OK The filter is deleted.

### Explorer for Endevor Element Actions

Once you identify the relevant data, you can perform the following actions:
- Browse Element

  Displays the contents of the Element, including metadata, to help you determine if you want to retrieve and work with the Element.
- Retrieve Element

  Retrieves the Element, with no additional data. The Element is stored locally while you work with it, and you can then apply your changes.
- Retrieve Element with Dependencies

  Retrieves the Element, with additional information highlighting any other elements or processes that use the element in its current state. The Element is stored locally while it is worked on, before you then upload it back to the main repository.
- Retrieve Multiple Elements

  Retrieves the several selected Elements, with no additional data. The Elements are stored locally while being worked on, before you then upload them back to the main repository.

#### Browse Element
The Browse Element action displays the entire contents of the Element, including related metadata. This allows you to determine if you want to retrieve and work with the Element
#### Follow these steps:
1. Right-click on the element in either the Map or Filters view. The options to Browse or Retrieve the Element appear.
2. Select the Browse Element option. The Element is displayed in the panel, including related information, as follows:

```
*1CA Endevor SCM Version 18.0.12 Copyright (C) 1986-2018 CA. All Rights
PROBLEM CA Endevor SCM
PRINT BROWSE
ELEMENT: DELPROC
**********************************************************************************************
**********************************************************************************************
** **
** ELEMENT BROWSE 14MAY19 11:38 **
** **
** ENVIRONMENT: ENV1 SYSTEM: QAPKG SUBSYSTEM: SBSQAPKG **
** TYPE: PROCESS STAGE ID: 1 **
** ELEMENT: DELPROC **
** **
** SIGNED OUT TO: PABJU03 DELTA TYPE: REVERSE **
** **
**********************************************************************************************
-------------------------- SOURCE LEVEL INFORMATION ---------------------------
VVLL SYNC USER DATE TIME STMTS CCID COMMENT
---- ---- -------- ------- ----- -------- ------------ ----------------------------------------
0100 PABJU03 14MAY19 08:25 2
GENERATED PABJU03 14MAY19 08:25

+0100 //DELPROC PROC
+0100 //DELMOD EXEC PGM=CONDELE,PARM=*COMPONENTS*
```

3. Review the displayed information to determine if it is relevant or useful to you.

You have successfully opened an element for inspection.
#### Note:
Elements are read-only in their native location. To edit an Element, perform the Retrieve Element action and store a copy of the Element to your specified Workspace.

#### Retrieve Element
The Retrieve Element action allows you to save a copy of the Element to your workspace. The data can then be edited as required.
#### Follow these steps:
1. Right-click on the element in either the Map or Filters view. The options to Browse or Retrieve Element are displayed.
2. Select Retrieve Element. The Element is saved to your specified Workspace and is displayed in the panel, including related information, as follows:
    ```
    //DELPROC PROC
    //DELMOD EXEC PGM=CONDELE,PARM=*COMPONENTS
    ```
You can now work with the Element, and save the newly edited element to your Workspace.

You have successfully retrieved an element.

#### Retrieve Element with Dependencies
The Retrieve Element with Dependencies action allows you to save a copy of the Element, along with any other elements that are dependent on it. The data is saved in your specified Workspace, and can be edited as required

#### Follow these steps:
1. Locate the Element that you want to retrieve in either the Map or Filter view.
2. Right-click on the Element. The following options are displayed:
    - Browse Element
    - Retrieve Element
    - Retrieve Element with Dependencies
3. Select Retrieve Element with Dependencies.
The Element is saved to your specified Workspace, along with any dependencies.

The Elements and dependencies are displayed in the panel in separate tabs, as follows:

Element:
    ********************************************************************
    * ACMQAPIA : call ACMQ API programs (ACMQAPI2) *
    * *
    * Change INVOKE to ACMQAPI1/2/3 to test other programs *
    ******************************************************************** 
    ACMQAPIA @C1INIT INVOKE=(ACMQAPI2,DYNAM), X 
    TYPE=ACMQ_batch, X  
    STACK=72000, X 
    ESTAE=NO, X 
    SLAT=YES 
    END

First Dependency:

    ASMA90 = 'RENT,TERM,XREF(SHORT),USING(MAP,WARN(11)),LIST(133),'+ 00000010'LANGUAGE(UE),' 00000110IGYCRCTL       ='OBJECT,APOST,AWO,DATA(24),FASTSRT,FLAG(W),'+ 00000200'LIST,RENT,TRUNC(BIN),'+ 00000300'NODBCS,SOURCE,MAP,NOSEQ,XREF,
    NONUMBER,LIST,' 00000400IEWL = 'LIST,MAP,RENT,REUS,NOLET,XREF,SIZE=(256K,64K),' 00000500CCNDRVR = 'SOURCE,SHOWINC,LIST,NOOPT,AGG,XR,LO,ARCH(3),' 00000600

Second Dependency:

MACRO 00001 $$ABCD &ROL=,&CODE= 00002 .* ABCD= IS A 4 CHARACTER CODE 00003 AIF ('&CODE' EQ '').DONE 00004 .GEN $$ABSEXP ROL=&ROL,ARG=&CODE,TYPE=OT$$ABCD,FMT=C4 00005 .DONE ANOP 00006 MEND 00007

You can now work with the Element and dependencies stored in your Workspace

You have successfully retrieved an element.

##### Notes:
    - All dependencies are saved to the Workspace in appropriate folders based on their type
    - If the type folder for the dependencies doesn't exist new folder is created
    - No limit on the number of dependencies for the retrieved Element
    - Retrieve Element with Dependencies is not compatible with the Retrieve Multiple Elements action.

#### Retrieve Multiple Elements

The Retrieve Multiple Elements action allows you to save a copy of several Elements in a single action. The elements are saved without related metadata to your workspace, grouped in folders by Type. The elements can be used as required, and then merged back to the desired location, or used elsewhere.

As a developer unfamiliar with the classic Endevor interface, you need to retrieve a multiple elements to your Workspace. This action allows you to retrieve several elements simultaneously, ensuring that you receive an accurate impression of the elements at the same point in time.

##### Prerequisite:
    - Workspace established and open in Visual Studio Code Explorer

##### Follow these steps:
1. Ensure that you have an open workspace in Visual Studio Code Explorer
2. Left-click on the first element that you want to retrieve in either the Map or Filters view.
3. Hold Shift and use the arrow keys to move up or down to select multiple elements that you want to retrieve
4. Right-click on selected elements that you want to retrieve. The options to Browse or Retrieve Element appear.
5. Select Retrieve Element.
6. The Elements will be saved sequentially to your specified Workspace, sorted info folders according to Type.
7. The Elements are displayed as multiple separate tabs in the panel, including related information, as follows:
    //DELPROC PROC
    //DELMOD EXEC PGM=CONDELE,PARM=*COMPONENTS
    
You have successfully retrieved multiple elements and can now work with them in Visual Studio Code or your preferred IDE.