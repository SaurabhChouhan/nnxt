import React, {Component} from 'react'
import {WithContext as ReactTags} from 'react-tag-input';
import {required} from "../forms/validation";
import {renderText} from "../forms/fields";

class RepositorySearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedValue: 'All',
            type: ['All', 'Feature', 'Task'],
            tags: [],
            suggestions: this.props.estimation && this.props.estimation.technologies ? this.props.estimation.technologies : [],
            searchText: ''
        };
        this.props.estimation.technologies.map((f, i) => {
            this.state.tags.push({
                id: this.state.tags.length + 1,
                text: f
            });
        })
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.searchText = this.searchText.bind(this);

    }

    handleSelectChange(e) {
        this.setState({selectedValue: e.target.value});
    }

    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }

    handleAddition(tag) {
        let tags = this.state.tags;
        if (!(tags.findIndex(f => f.text.toLowerCase() === tag.toLowerCase()) != -1)) {
            tags.push({
                id: tags.length + 1,
                text: tag
            });
            this.setState({tags: tags});
        }
    }

    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({tags: tags});
    }

    searchText(searchText) {
        this.setState({searchText: searchText.target.value});
    }

    render() {
        const {tags, suggestions} = this.state;
        return (
            <div>
                <div className="col-md-12 RepositoryHeading RepositorySideHeight">


                    <div className="row">
                        <div className="col-md-6 searchText">
                            <input type="text" className="form-control" placeholder="Search Features/Tasks"
                                   onChange={this.searchText}/>
                        </div>
                        <div className="col-md-4 dropdownoptionRepo">
                            <select className="form-control "
                                    onChange={this.handleSelectChange}>
                                {
                                    this.state.type.map((item, key) =>
                                        <option value={item} key={key}>{item}</option>
                                    )
                                }
                            </select>
                        </div>
                        <div className="col-md-2 repoArrow">
                            <h5><img key="he_requested_delete" src="/images/go_button.png"
                                     onClick={() => {
                                         this.props.fetchRepositoryBasedOnDiffCriteria(this.state.tags, this.state.selectedValue,this.state.searchText)
                                     }}/></h5>
                        </div>
                    </div>

                    {/*<div  className="col-md-12">
                        <div className="col-md-6">

                            <div className="searchText">
                                <input type="text" className="form-control" placeholder="Search Features/Tasks"
                                       onChange={this.searchText}/>
                            </div>

                        </div>
                        <div className="col-md-4">
                            <div className="dropdownoption">
                                <select className="form-control "
                                        onChange={this.handleSelectChange}>
                                    {
                                        this.state.type.map((item, key) =>
                                            <option value={item} key={key}>{item}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="backarrow">
                                <h5><img key="he_requested_delete" src="/images/go_button.png"
                                         onClick={() => {
                                             this.props.fetchRepositoryBasedOnDiffCriteria(this.state.tags, this.state.selectedValue)
                                         }}/></h5>
                            </div>
                        </div>
                    </div>*/}
                    </div>

                <div className="col-md-11">
                    <ReactTags
                        classNames=
                            {{
                                tags: 'tagsClass',
                                tagInput: 'tagInputClass',
                                tagInputField: 'tagInputFieldClass',
                                selected: 'selectedClass',
                                tag: 'tagClass technologytagNew',
                                remove: 'removeClass',
                                suggestions: 'suggestionsClass',
                                activeSuggestion: 'activeSuggestionClass'
                            }}
                        tags={tags}
                        suggestions={suggestions}
                        autofocus={false}
                        placeholder="Repository"
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        handleDrag={this.handleDrag}/>
                </div>

                <div className="col-md-12 Repo-padding">

                    {
                        Array.isArray(this.props.repository) && this.props.repository.map((f, i) =>
                            (f.isFeature) ?
                                [<div key={"feature" + f._id} className="repository repositoryFeature">
                                    <div className="RepositoryHeading" key={i} onClick={() => {
                                        this.props.showFeatureDetailPage(f)
                                    }}>
                                        <div>
                                            <div className="repositoryFeatureLable"></div>
                                            <h5>Feature: {f.name}</h5><i
                                            className="glyphicon glyphicon-option-vertical pull-right"></i><span
                                            className="pull-right">(04 HRS)</span></div>
                                    </div>
                                    <div className="RepositoryContent">
                                        <p>{f.description}</p>
                                    </div>
                                </div>]
                                :
                                [<div key={"task" + f._id} className="repository repositoryTask">
                                    <div className="RepositoryHeading" key={i} onClick={() => {
                                        this.props.showTaskDetailPage(f)
                                    }}>
                                        <div>
                                            <div className="repositoryTaskLable"></div>
                                            <h5>Task: {f.name}</h5><i
                                            className="glyphicon glyphicon-option-vertical pull-right"></i><span
                                            className="pull-right">(04 HRS)</span></div>
                                    </div>
                                    <div className="RepositoryContent">
                                        <p>{f.description}</p>
                                    </div>
                                </div>]
                        )
                    }
                </div>

            </div>)
    }

}

export default RepositorySearch